import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent, ModalBase } from "../base-modal/base-modal.component";
import { SaidaFormDataIn, SaidaFormDataOut } from '../saida-modal/saida-modal';
import { SaidaType } from '../../../types/saida.type';
import { MatIconModule } from '@angular/material/icon';
import { EntradaDto, ProdutoIO, WT } from '../entrada-modal/entrada-modal';
import { WebSocketService } from '../../../service/ws.service';
import { EstoqueItem } from '../../../pages/estoque/estoque';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingService } from '../loading-page/LoadingService.service';

export interface TransferenciaDto {
  user: number;
  data: string;
  estoqueId: number;
  endereco: Record<string, string>;
  observacoes?: string;
  produtos: Array<Record<string, any>>;
}

export enum States {
  NONE, LOAD, COMPLETE
}


@Component({
  selector: 'app-transferencia-modal',
  imports: [CommonModule, FormsModule, BaseModalComponent, MatIconModule,MatTooltipModule],
  templateUrl: './transferencia-modal.html',
  styleUrl: './transferencia-modal.scss'
})
export class TransferenciaModal extends ModalBase {
  @Output() submitForm = new EventEmitter<any>();

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)

  public WT = WT;
  public States = States;
  produtos: ProdutoIO[] = []
  temProdutosIn: States = States.NONE;
  tooltipDisabled = true;



  enderecoOld = 'SEM END'
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
      else if (data.type === 'transferencia_resposta') {

        if (data.status === 'ok') {
          this.submitForm.emit()
          // this.loadingService.hide();
          this.onCloseBase()
        }
        else {
          this.loadingService.hide();
          alert(data.mensagem)
        }
      }
    });

  }

  formData!: EstoqueItem;


  openx(itemData: EstoqueItem) {
    this.onClear()
    console.log('itemData', itemData);
    this.enderecoOld = itemData.enderecoId
    this.isOpen = true;
    if (itemData) {
      this.formData = { ...itemData };
      this.produtos.push({ codigo: itemData.codigo, quantidade: itemData.quantidade, fardo: itemData.fardo, quebra: itemData.quantidade, wt: WT.OUT })
    }

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
  }

  submit() {

    const produtoInsert = this.produtos.filter(x => x.wt === WT.OUT)

    const produtosList = this.produtos
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


    const movimentacaoDto: TransferenciaDto = {
      user: this.wsService.UserCurrent.userId,
      data: new Date().toISOString(),
      estoqueId: this.formData.estoqueId,
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
      action: 'transferencia',
      dados: movimentacaoDto
    });
    this.loadingService.show();
  }

  onClear() {
    this.local = '';
    this.rua = '';
    this.coluna = '';
    this.palete = '';

    this.observacao = '';

    this.produtos = [];
    this.temProdutosIn = States.NONE;

    // reseta formData
    this.formData = {} as EstoqueItem;
  }

  showTooltip() {
    this.tooltipDisabled = false;
    setTimeout(() => this.tooltipDisabled = true, 2000);
  }
}
