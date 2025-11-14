import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent, ModalBase } from "../base-modal/base-modal.component";
import { MatIconModule } from '@angular/material/icon';
import { WebSocketService } from '../../../service/ws.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingService } from '../loading-page/LoadingService.service';
import { Origem, ProdutoSpDto, PropsPST, ResponseGetAddress } from '../entrada-modal/index.interface';
import { EstoqueItem } from '../../estoque/index.interface';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogDescricaoComponent } from '../dialog-descricao/dialog-descricao';
import { TransferenciaDto } from './index.interface';


export enum States {
  NONE, LOAD, COMPLETE
}


@Component({
  selector: 'app-transferencia-modal',
  imports: [CommonModule, FormsModule, BaseModalComponent, MatIconModule, MatTooltipModule],
  templateUrl: './transferencia-modal.html',
  styleUrl: './transferencia-modal.scss'
})
export class TransferenciaModal extends ModalBase {



  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private toastr: ToastrService = inject(ToastrService);
  private _snackBar = inject(MatSnackBar);
  private dialog: MatDialog = inject(MatDialog)
  protected OpenSub: boolean = true;

  public WT = Origem;
  public Origem = Origem;
  tooltipDisabled = true;
  produtos: ProdutoSpDto[] = []
  public States = States;
  temProdutosIn: States = States.NONE;
  rua: string = '';
  bloco: string = '';
  apt: string = '';
  enderecoOld: string = ''
  observacao: string = '';


  ngOnInit(): void {



    this.wsService.messages$.subscribe(data => {

      if (!data) return;
      this.loadingService.hide();
      if (data.type === 'get_address_resposta') {
        this.temProdutosIn = States.LOAD;

        if (data.status === "ok" && data.dados) {
          const produtosInEndereco = data.dados as ResponseGetAddress[];

          const produtosSemIn = this.produtos.filter(x => x.propsPST.origem !== Origem.IN);

          const novosProdutosIn: ProdutoSpDto[] = produtosInEndereco.map(p => ({
            produtoId: p.ProdutoId,
            codigo: p.Codigo,
            descricao: p.Descricao,
            lote: p.Lote,
            dataf: p.DataF,
            semf: p.SemF,
            quantidade: p.Quantidade,
            enderecoId: p.EstoqueId,
            propsPST: { isModified: false, origem: Origem.IN } as PropsPST
          }));

          this.produtos = [...produtosSemIn, ...novosProdutosIn];
        }
        else {
          this.getProdutosFiltrados();
          // this._snackBar.open(data.mensagem, "OK");
        }
        this.temProdutosIn = States.COMPLETE;

      }
      else if (data.type === 'transferencia_resposta') {

        if (data.status === 'ok') {
          this.toastr.success(data.mensagem || 'Operação realizada com sucesso!', 'Sucesso');
          this.wsService.send({ action: 'get_estoque' });
          this.onCloseBase()
        }
        else {
          this.toastr.error(data.mensagem || 'Erro inesperado', 'Erro');
        }
      }
    });

  }

  formData!: EstoqueItem;


  openx(itemData: EstoqueItem) {
    this.onClear()
    this.enderecoOld = itemData.enderecoId ?? ''
    this.isOpen = true;
    if (itemData) {
      this.formData = { ...itemData };
      if (itemData.produto) {
        const p = itemData.produto;

        this.produtos.push({
          produtoId: itemData.produtoId,
          codigo: p.codigo,
          descricao: p.descricao,
          quantidade: itemData.quantidade,
          dataf: itemData?.dataF,
          semf: itemData?.semF,
          lote: itemData.lote ?? '',
          propsPST: {
            origem: Origem.OUT,
            isModified: false
          }
        });
      }
    }

  }

  existWTIN(): Boolean {
    return this.produtos.some(p => p.propsPST.origem === Origem.IN);
    return false
  }

  getProdutosFiltrados() {
    this.produtos = this.produtos.filter(p => p.propsPST.origem !== Origem.IN);
  }

  getAddress() {

    if (!this.rua || !this.bloco || !this.apt) {
      alert('Preencha todos os campos antes de continuar.');
      return;
    }
    const add = {
      rua: this.rua,
      bloco: this.bloco,
      apt: this.apt
    };

    this.wsService.send({
      action: 'get_address',
      data: add
    });
    this.loadingService.show();
  }

  submit() {

    if (!this.rua || !this.bloco || !this.apt) {
      this.toastr.warning('Por favor, preencha Rua, Bloco e Apt.', 'Campos obrigatórios');
      return;
    }


    if (this.wsService.UserCurrent) {


      const movimentacaoDto: TransferenciaDto = {
        userId: this.wsService.UserCurrent.UserId,
        dataEntrada: this.formData.dataL,
        estoqueID: this.formData.estoqueId,
        rua: this.rua,
        bloco: this.bloco,
        apt: this.apt,
        //@ts-ignore
        endOld: this.formData.enderecoId,
        observacao: this.observacao,
        produto: {
          produtoId: this.formData.produtoId,
          codigo: this.formData.produto?.codigo ?? '',
          descricao: this.formData.produto?.descricao ?? '',
          quantidade: this.formData.quantidade,
          dataf: this.formData?.dataF,
          semf: this.formData?.semF,
          lote: this.formData.lote ?? '',
          propsPST: {
            origem: Origem.OUT,
            isModified: false
          }
        }

      };

      this.wsService.send({
        action: 'transferencia',
        data: movimentacaoDto
      });
      this.loadingService.show();
    }

  }

  onClear() {
    this.rua = '';
    this.bloco = '';
    this.apt = '';
    this.enderecoOld = ''
    this.observacao = '';
    this.produtos = [];
    this.temProdutosIn = States.NONE;

    // reseta formData
    this.formData = {} as EstoqueItem;
  }
  mostrarDescricao(item: ProdutoSpDto) {
    this.dialog.open(DialogDescricaoComponent, {
      data: { descricao: item.descricao },
      panelClass: 'descricao-dialog-panel',
      hasBackdrop: true
    });
  }
}
