import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalBase, BaseModalComponent } from '../base-modal/base-modal.component';
import { WebSocketService } from '../../../service/ws.service';
import { Pipe, PipeTransform } from '@angular/core';
import { FilterWT } from "../../../pipe/filterWT";
import { AddProduto, AddProdutoModal } from '../add-produto-modal/add-produto-modal';
import { SaidaType } from '../../../types/saida.type';
import { MatIconModule } from '@angular/material/icon'
import { States } from '../transferencia-modal/transferencia-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogDescricaoComponent } from '../dialog-descricao/dialog-descricao';
import { LoadingService } from '../loading-page/LoadingService.service';
import { Origem, ProdutoSpDto, PropsPST, ResponseGetAddress } from './index.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


export enum WT {
  NONE = "NONE",
  IN = "IN",
  OUT = "OUT"
}

export interface ProdutoIO {
  isEdit?: boolean
  codigo?: string
  descricao?: string
  produto?: string
  fardo?: number
  quantidade?: number
  quebra?: number
  modelo?: string
  wt?: WT
}
export interface EntradaDto {
  user: number;
  data: string;
  endereco: Record<string, string>;
  observacoes?: string;
  produtos: Array<Record<string, any>>;
}













@Component({
  selector: 'app-entrada-modal',
  imports: [CommonModule, FormsModule, BaseModalComponent, AddProdutoModal, MatIconModule, MatTooltipModule,MatSnackBarModule],
  templateUrl: './entrada-modal.html',
  styleUrl: './entrada-modal.scss'
})
export class EntradaModal extends ModalBase implements OnInit {

  @Input() itemData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private _snackBar = inject(MatSnackBar);

  
  public WT = Origem;
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
        else{
          this._snackBar.open(data.mensagem, "OK");
        }
        this.temProdutosIn = States.COMPLETE;
        this.loadingService.hide();
      }

      else if (data.type === 'entrada_resposta') {
        // this.loadingService.hide();
        if (data.status === 'ok') {
          this.submitForm.emit()
          this.onCloseBase()
        }
        else {
          alert(data.mensagem)
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

    if (this.wsService.UserCurrent) {
      const produtoInsert = this.produtos.filter(x => x.propsPST.origem === this.WT.IN);


      if (produtoInsert.length <= 0) {
        alert('Adicione ao menos um produto.');
        return
      }

      // const produtosList = this.produtos
      //   .filter(p =>  x.propsPST.origem === origin)
      //   .map(p => {
      //     const fardo = p.fardo ? Number(p.fardo) : 0;
      //     const quantidade = p.quantidade ? Number(p.quantidade) : 0;
      //     const quebra = p.quebra ? Number(p.quebra) : 0;
      //     const total = fardo * quantidade + quebra;

      //     return {
      //       codigo: p.codigo,
      //       descricao: p.descricao,
      //       fardo,
      //       quantidade,
      //       quebra,
      //       total
      //     };
      //   });



      // const movimentacaoDto: EntradaDto = {
      //   userId: this.wsService.UserCurrent.userId,
      //   // data: new Date().toISOString(),
      //   // endereco: {
      //   //   local: this.local,
      //   //   rua: this.rua,
      //   //   coluna: this.bloco,
      //   //   palete: this.apt
      //   // },
      //   // observacoes: this.observacao,
      //   // produtos: produtosList
      // };

      // this.wsService.send({
      //   action: 'entrada',
      //   dados: movimentacaoDto
      // });
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
