import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent, ModalBase } from "../base-modal/base-modal.component";
import { WebSocketService } from '../../../service/ws.service';
import { LoadingService } from '../loading-page/LoadingService.service';
import { SaidaDto } from './index.interface';
import { EstoqueItem } from '../../estoque/index.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-saida-modal',
  imports: [CommonModule, FormsModule, BaseModalComponent],
  templateUrl: './saida-modal.html',
  styleUrl: './saida-modal.scss',
})
export class SaidaModal extends ModalBase implements OnInit {


  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private toastr:ToastrService  = inject (ToastrService);
  protected formData: EstoqueItem | null = null;
  protected formDataQtd!: number;
  protected formDataObs: string | null = null;

  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'saida_resposta') {
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


  openx(data?: EstoqueItem) {
    this.isOpen = true;
    this.onClear();
    if (data) {
      console.log('data', data);
      this.formData = data
    }
  }


  submit() {
    if (this.wsService.UserCurrent) {
      if (this.formData) {
        const saidaDto: SaidaDto = {
          userId: this.wsService.UserCurrent.UserId,
          qtdRetirada: this.formDataQtd,
          observacao: this.formDataObs ?? undefined,
          estoqueId: this.formData?.estoqueId
        };
        this.wsService.send({
          action: 'saida',
          data: saidaDto
        });
        this.loadingService.show();
      }

    }

  }

  onClear() {
    this.formData = null;

    this.formDataQtd = 0;
    this.formDataObs=null
  }

}
