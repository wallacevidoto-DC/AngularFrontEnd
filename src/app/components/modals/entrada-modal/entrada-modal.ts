import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalBase, BaseModalComponent } from '../base-modal/base-modal.component';
import { WebSocketService } from '../../../service/ws.service';
import { AddProduto, AddProdutoModal } from '../add-produto-modal/add-produto-modal';
import { MatIconModule } from '@angular/material/icon'
import { States } from '../transferencia-modal/transferencia-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogDescricaoComponent } from '../dialog-descricao/dialog-descricao';
import { LoadingService } from '../loading-page/LoadingService.service';
import { EntradaDto, Origem, ProdutoSpDto, PropsPST, ResponseGetAddress } from './index.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-entrada-modal',
  imports: [CommonModule, FormsModule, BaseModalComponent, AddProdutoModal, MatIconModule, MatTooltipModule, MatSnackBarModule],
  templateUrl: './entrada-modal.html',
  styleUrl: './entrada-modal.scss'
})
export class EntradaModal extends ModalBase implements OnInit {

  @Input() itemData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private toastr: ToastrService = inject(ToastrService);
  private _snackBar = inject(MatSnackBar);
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

  observacao: string = '';


  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

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
          this._snackBar.open(data.mensagem, "OK");
        }
        this.temProdutosIn = States.COMPLETE;
        this.loadingService.hide();
      }
      else if (data.type === 'entrada_resposta') {
        this.loadingService.hide();
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

  formData!: AddProduto;

  private dialog: MatDialog = inject(MatDialog)

  openx(itemData: any = null) {
    this.isOpen = true;
    this.onClear();
    if (itemData) this.formData = { ...itemData };
  }

  existWTIN(): Boolean {
    return this.produtos.some(p => p.propsPST.origem === this.WT.IN);
  }

  getProdutosFiltrados(): ProdutoSpDto[] {
    return this.produtos.filter(p => p.propsPST.origem === this.WT.IN);
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
      const produtoInsert = this.produtos.filter(p => p.propsPST.origem === Origem.OUT);

      if (produtoInsert.length <= 0) {
        this.toastr.warning('Adicione ao menos um produto.');
        return
      }
      const movimentacaoDto: EntradaDto = {
        userId: this.wsService.UserCurrent.UserId,
        dataEntrada: new Date(),
        rua: this.rua,
        bloco: this.bloco,
        apt: this.apt,
        observacao: this.observacao,
        produtos: produtoInsert
      };

      console.log('movimentacaoDto:', movimentacaoDto);

      this.wsService.send({
        action: 'entrada',
        data: movimentacaoDto
      });
      this.loadingService.show();
    }

  }

  enviar($event: ProdutoSpDto) {
    if ($event) {
      this.produtos.push($event)
    }
  }

  onClear() {
    this.produtos = [];
    this.temProdutosIn = States.NONE;

    this.rua = '';
    this.bloco = '';
    this.apt = '';
    this.observacao = '';

    // this.formData = {
    //   codigo: '',
    //   // fardo: 0,
    //   quantidade: 0,
    //   // quebra: 0,
    // };
  }
  showTooltip() {
    this.tooltipDisabled = false;
    setTimeout(() => this.tooltipDisabled = true, 2000);
  }

  mostrarDescricao(item: ProdutoSpDto) {
    this.dialog.open(DialogDescricaoComponent, {
      data: { descricao: item.descricao },
      panelClass: 'descricao-dialog-panel',
      hasBackdrop: true
    });
  }

  deletarItem(item: ProdutoSpDto) {
    // if (item.wt === WT.OUT) {
    //   this.produtos = this.produtos.filter(p => p !== item);
    // }
  }
} 
