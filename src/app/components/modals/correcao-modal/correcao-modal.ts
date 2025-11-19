import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BaseModalComponent, ModalBase } from '../base-modal/base-modal.component';
import { WebSocketService } from '../../../service/ws.service';
import { LoadingService } from '../loading-page/LoadingService.service';
import { EstoqueItem } from '../../estoque/index.interface';
import { CorrecaoDto } from './index.interface';
import { Origem } from '../entrada-modal/index.interface';
import { ToastrService } from 'ngx-toastr';

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
  private toastr: ToastrService = inject(ToastrService);
  protected formData: EstoqueItem = {
    estoqueId: 0,
    produtoId: 0,
    semF: 0,
    quantidade: 0,
    dataF: '',
    dataL: '',
    createAt: '',
    updateAt: '',
    produto: {
      codigo: '',
      descricao: ''
    }
  };


  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'correcao_resposta') {
        if (data.status === 'ok') {
          this.toastr.success(data.mensagem || 'Operação realizada com sucesso!', 'Sucesso');
          this.wsService.send({ action: 'get_estoque' });
          this.onCloseBase()
        }
        else {
          this.toastr.error(data.mensagem || 'Erro inesperado', 'Erro');
        }
      }
      this.loadingService.hide();
    });

  }


  openx(data?: EstoqueItem) {
    this.isOpen = true;
    this.onClear();
    if (data) {
      this.formData = {
        ...data,
        dataF: this.convertMMYYtoYYYYMM(data.dataF),
      };

      console.log('data', data);

    }
  }

  private convertMMYYtoYYYYMM(value: string | null | undefined): string {
    if (!value) return '';

    if (/^\d{2}\/\d{2}$/.test(value)) {
      const [mm, yy] = value.split('/');
      return `20${yy}-${mm}`;
    }

    return value; // caso já venha no formato certo
  }
  converterMesAno(valor: string): string {
    if (!valor) return '';
    const [ano, mes] = valor.split('-');
    return `${mes}/${ano.slice(2)}`;
  }
  submit() {
    if (this.wsService.UserCurrent && this.formData) {

      const correcaoDto: CorrecaoDto = {
        tipo: "CORRECAO",
        userId: this.wsService.UserCurrent.UserId,
        estoqueId: this.formData.estoqueId,
        observacao: this.formData.obs ?? '',
        produto: {
          produtoId: this.formData.produtoId,
          codigo: this.formData.produto?.codigo ?? "",
          descricao: this.formData.produto?.descricao ?? "",
          quantidade: this.formData.quantidade,
          dataf: this.converterMesAno(this.formData.dataF.toString()),
          semf: this.formData.semF,
          lote: this.formData.lote ?? "",
          propsPST: {
            origem: Origem.IN,
            isModified: true
          }
        }
      };
      this.wsService.send({
        action: 'correcao',
        data: correcaoDto
      });
      this.loadingService.show();
    }
  }
  onClear() {
    this.formData = {
      estoqueId: 0,
      produtoId: 0,
      semF: 0,
      quantidade: 0,
      dataF: '',
      dataL: '',
      createAt: '',
      updateAt: '',
      produto: {
        codigo: '',
        descricao: ''
      }
    }
  }
}
