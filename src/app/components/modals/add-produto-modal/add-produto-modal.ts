import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaidaType } from '../../../types/saida.type';
import { BaseModalComponent, ModalBase } from "../base-modal/base-modal.component";
import { WebSocketService } from '../../../service/ws.service';
import { ProdutoIO, WT } from '../entrada-modal/entrada-modal';
import { MatIconModule } from '@angular/material/icon'
import { LoadingService } from '../loading-page/LoadingService.service';

export interface AddProduto {
  codigo: string;
  fardo: number;
  quantidade: number;
  quebra: number;
}

export interface SaidaFormDataOut {
  estoqueId: number
  fardo: number;
  quantidade: number;
  quebra: number;
  observacao: string;
}

@Component({
  selector: 'app-add-produto-modall',
  imports: [CommonModule, FormsModule, BaseModalComponent, MatIconModule],
  templateUrl: './add-produto-modal.html',
  styleUrl: './add-produto-modal.scss'
})
export class AddProdutoModal extends ModalBase implements OnInit {

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  produto: ProdutoIO = {
  codigo: '',
  descricao: '',
  produto: '',
  modelo: '',
  wt: WT.NONE
};

  ngOnInit(): void {
    
    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'in_produto' && data.produto) {
        const novosProdutos = data.produto as ProdutoIO;

        this.produto = { codigo: novosProdutos.codigo, descricao: novosProdutos.descricao, produto: novosProdutos.produto, modelo: novosProdutos.modelo }
        this.loadingService.hide();
      }
    });
  }

  @Output() submitForm = new EventEmitter<AddProduto>();

  openFlag = false;
  total: number = 0

  formData = {
    codigo: '',
    fardo: 0,
    quantidade: 0,
    quebra: 0,
  } as AddProduto;



  openx() {
    this.isOpen = true;
    this.onClear()

  }


  calcularTotal() {
    const t = this.formData.fardo * this.formData.quantidade + this.formData.quebra;
    this.total = t < 0 ? 0 : t;
  }

  buscarProduto() {
    this.wsService.send({
      action: 'get_produto',
      data: this.formData.codigo
    });
    this.loadingService.show();
  }

  submit() {

    this.formData.codigo = this.formData.codigo.toLocaleUpperCase()
    this.submitForm.emit(this.formData);
    this.loadingService.hide();
    this.onClear();
    this.onCloseBase()
  }

  onClear() {
    this.formData = {
      codigo: '',
      fardo: 0,
      quantidade: 0,
      quebra: 0,
    };

    this.total = 0;
    this.produto = {
      codigo: '',
      descricao: '',
      produto: '',
      modelo: '',
      wt: WT.NONE
    };
  }

}
