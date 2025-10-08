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
  imports: [CommonModule, FormsModule, BaseModalComponent, AddProdutoModal, MatIconModule, MatTooltipModule],
  templateUrl: './entrada-modal.html',
  styleUrl: './entrada-modal.scss'
})
export class EntradaModal extends ModalBase implements OnInit {

  @Input() itemData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  
  public WT = WT;
  tooltipDisabled = true;
  produtos: ProdutoIO[] = []
  public States = States;
  temProdutosIn: States = States.NONE;
  local: string = '';
  rua: string = '';
  coluna: string = '';
  palete: string = '';

  observacao: string = '';


  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'in_address' && data.produtos) {
        this.temProdutosIn = States.LOAD
        const novosProdutos = data.produtos as ProdutoIO[];

        const produtosSemIn = this.produtos.filter(x => x.wt !== WT.IN);

        const produtosAtualizados = [
          ...produtosSemIn,
          ...novosProdutos.map(x => ({
            fardo: x.fardo,
            isEdit: false,
            produto: x.produto,
            quantidade: x.quantidade,
            quebra: x.quebra,
            wt: WT.IN,
            codigo: x.codigo,
            descricao: x.descricao,
            modelo: x.modelo
          }))
        ];

        this.produtos = produtosAtualizados;
        console.log('this.produtos', this.produtos);
        this.temProdutosIn = States.COMPLETE
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
    return this.produtos.some(p => p.wt === WT.IN);
  }

  getProdutosFiltrados(): ProdutoIO[] {
    return this.produtos.filter(p => p.wt !== WT.IN);
  }

  getAddress() {

    if (!this.local || !this.rua || !this.coluna || !this.palete) {
      alert('Preencha todos os campos antes de continuar.');
      return;
    }
    const add = {
      local: this.local,
      rua: this.rua,
      coluna: this.coluna,
      palete: this.palete
    };

    this.wsService.send({
      action: 'get_address',
      data: add
    });
    this.loadingService.show();
  }

  submit() {

    const produtoInsert = this.produtos.filter(x => x.wt === WT.OUT)


    if (produtoInsert.length <= 0) {
      alert('Adicione ao menos um produto.');
      return
    }

    const produtosList = this.produtos
      .filter(p => p.wt === WT.OUT)
      .map(p => {
        const fardo = p.fardo ? Number(p.fardo) : 0;
        const quantidade = p.quantidade ? Number(p.quantidade) : 0;
        const quebra = p.quebra ? Number(p.quebra) : 0;
        const total = fardo * quantidade + quebra;

        return {
          codigo: p.codigo,
          descricao: p.descricao,
          fardo,
          quantidade,
          quebra,
          total
        };
      });



    const movimentacaoDto: EntradaDto = {
      user: this.wsService.UserCurrent.userId,
      data: new Date().toISOString(),
      endereco: {
        local: this.local,
        rua: this.rua,
        coluna: this.coluna,
        palete: this.palete
      },
      observacoes: this.observacao,
      produtos: produtosList
    };

    this.wsService.send({
      action: 'entrada',
      dados: movimentacaoDto
    });
    this.loadingService.show();
  }

  enviar($event: AddProduto) {

    if ($event) {
      this.produtos.push({ codigo: $event.codigo, quantidade: $event.quantidade, fardo: $event.fardo, quebra: $event.quebra, wt: WT.OUT })
    }
  }

  onClear() {
    this.produtos = [];
    this.temProdutosIn = States.NONE;

    this.local = '';
    this.rua = '';
    this.coluna = '';
    this.palete = '';
    this.observacao = '';

    this.formData = {
      codigo: '',
      fardo: 0,
      quantidade: 0,
      quebra: 0,
    };
  }
  showTooltip() {
    this.tooltipDisabled = false;
    setTimeout(() => this.tooltipDisabled = true, 2000);
  }

  mostrarDescricao(item: ProdutoIO) {
    this.dialog.open(DialogDescricaoComponent, {
      data: { descricao: item.descricao },
      panelClass: 'descricao-dialog-panel',
      hasBackdrop: true
    });
  }

  deletarItem(item: ProdutoIO) {
    if (item.wt === WT.OUT) {
      this.produtos = this.produtos.filter(p => p !== item);
    }
  }
} 
