import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent, ModalBase } from '../base-modal/base-modal.component';
import { WebSocketService } from '../../../service/ws.service';
import { SaidaFormDataIn, SaidaFormDataOut } from '../saida-modal/saida-modal';
import { CorrecaoType } from '../../../types/correcao.type';
import { LoadingService } from '../loading-page/LoadingService.service';
import { EstoqueItem } from '../../estoque/estoque';

@Component({
  selector: 'app-correcao-modal',
  imports: [CommonModule, FormsModule, BaseModalComponent],
  templateUrl: './correcao-modal.html',
  styleUrl: './correcao-modal.scss'
})
export class CorrecaoModal extends ModalBase implements OnInit {
  @Input() itemData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  totalS: string = '';
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


  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'correcao_resposta') {
        if (data.status === 'ok') {
          this.submitForm.emit()
          this.onCloseBase()
          // this.loadingService.hide();
        }
        else {
          this.loadingService.hide();
          alert(data.mensagem)
        }
      }
    });

  }


  openx(data?: EstoqueItem) {
    this.isOpen = true;
    this.onClear();
    if (data) {
      // this.formData = { ...this.formData, ...data };
      this.formDataOut.estoqueId = this.formData.estoqueId
      this.calcularTotal();
      this.calcularTotalNew();
    }
  }

  calcularTotal() {
    const { fardo, quantidade, quebra } = this.formData;

    // Calcula o total real
    const t = fardo * quantidade + quebra;
    this.formData.total = t < 0 ? 0 : t;

    // Atualiza a string para exibir no input
    this.totalS = `${fardo}x${quantidade}+${quebra} = ${t}`;
  }
  calcularTotalNew() {
    const t = this.formDataOut.fardo * this.formDataOut.quantidade + this.formDataOut.quebra;
    this.totalNew = t < 0 ? 0 : t;
  }

  submit() {
    if (this.wsService.UserCurrent) {
      this.calcularTotal();

      const product: SaidaFormDataOut = { ...this.formDataOut, };
      const datas: CorrecaoType = {
        action: 'correcao',
        observacao: this.formDataOut.observacao,
        user: this.wsService.UserCurrent.userId,
        product
      };
      this.wsService.send(datas);
      this.loadingService.show();
    }
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
    };

    this.formDataOut = {
      estoqueId: 0,
      fardo: 0,
      quantidade: 0,
      quebra: 0,
      observacao: ''
    };

    this.totalS = '';
    this.totalNew = 0;
  }

}
