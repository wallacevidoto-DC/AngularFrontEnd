import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaidaType } from '../../../types/saida.type';
import { BaseModalComponent, ModalBase } from "../base-modal/base-modal.component";
import { WebSocketService } from '../../../service/ws.service';
import { LoadingService } from '../loading-page/LoadingService.service';


export interface SaidaFormDataIn {
  estoqueId: number;
  codigo: string;
  descricao: string;
  produto: string;
  modelo: string;
  fardo: number;
  quantidade: number;
  quebra: number;
  total: number;
  observacao: string;
}

export interface SaidaFormDataOut {
  estoqueId: number
  fardo: number;
  quantidade: number;
  quebra: number;
  observacao: string;
}

@Component({
  selector: 'app-saida-modal',
  imports: [CommonModule, FormsModule, BaseModalComponent],
  templateUrl: './saida-modal.html',
  styleUrl: './saida-modal.scss'
})
export class SaidaModal extends ModalBase implements OnInit {
  @Output() submitForm = new EventEmitter<SaidaType>();
  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)

  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'saida_resposta') {
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

  totalNew: number = 0
  formData = {
    estoqueId: 0,
    codigo: '',
    descricao: '',
    produto: '',
    modelo: '',
    fardo: 0,
    quantidade: 0,
    quebra: 0,
    total: 0,
    observacao: ''
  } as SaidaFormDataIn;

  formDataOut = {
    estoqueId: 0,
    fardo: 0,
    quantidade: 0,
    quebra: 0,
    observacao: '',
  } as SaidaFormDataOut;

  openx(data?: Partial<SaidaFormDataIn>) {
    this.isOpen = true;
    this.onClear();
    if (data) {
      console.log('data', data);

      this.formData = { ...this.formData, ...data };
      this.formDataOut.estoqueId = this.formData.estoqueId
      this.calcularTotal();
      this.calcularTotalNew();
    }
  }


  calcularTotal() {
    const t = this.formData.fardo * this.formData.quantidade + this.formData.quebra;
    this.formData.total = t < 0 ? 0 : t;
  }
  calcularTotalNew() {
    const t = this.formDataOut.fardo * this.formDataOut.quantidade + this.formDataOut.quebra;
    this.totalNew = t < 0 ? 0 : t;
  }

  submit() {
    this.calcularTotal();

    const product: SaidaFormDataOut = { ...this.formDataOut };
    const datas: SaidaType = {
      action: 'saida',
      user: this.wsService.UserCurrent.userId,
      product
    };
    this.wsService.send(datas);
    this.loadingService.show();
  }

  onClear() {
  this.formData = {
    estoqueId: 0,
    codigo: '',
    descricao: '',
    produto: '',
    modelo: '',
    fardo: 0,
    quantidade: 0,
    quebra: 0,
    total: 0,
    observacao: ''
  } as SaidaFormDataIn;

  this.formDataOut = {
    estoqueId: 0,
    fardo: 0,
    quantidade: 0,
    quebra: 0,
    observacao: ''
  } as SaidaFormDataOut;

  this.totalNew = 0;
}

}
