import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BaseModalComponent, ModalBase } from '../base-modal/base-modal.component';
import { WebSocketService } from '../../../service/ws.service';
import { LoadingService } from '../loading-page/LoadingService.service';
import { ToastrService } from 'ngx-toastr';
import { EntradasViewerDto } from '../../entrada/index.interface';
import { CorrecaoEntrada } from './index.interface';

@Component({
  selector: 'app-entrada-conferencia_correcao-modal',
  standalone:true,
  imports: [CommonModule, FormsModule, BaseModalComponent],
  templateUrl: './entrada-conferencia_correcao-modal.html',
  styleUrl: './entrada-conferencia_correcao-modal.scss'
})
export class EntradaConferenciaCorrecaoModal extends ModalBase implements OnInit {
  @Input() itemData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private toastr: ToastrService = inject(ToastrService);
  protected formData: EntradasViewerDto = {
    EntradaId: 0,
    Tipo: '',
    UserNome: '',
    ProdutoId: 0,
    ProdutoCodigo: '',
    ProdutoDescricao: '',
    QtdConferida: 0,
    QtdEntrada: 0,
    CifsNome: '',
    Lote: '',
    DataF: '',
    SemF: 0,
    CreateAt: new Date,
    UpdateAt: new Date
  };


  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'correcao_entrada_resposta') {
        if (data.status === 'ok') {
          this.toastr.success(data.mensagem || 'Operação realizada com sucesso!', 'Sucesso');
          this.wsService.send({ action: 'get_estoque_entrada' });
          this.onCloseBase()
        }
        else {
          this.toastr.error(data.mensagem || 'Erro inesperado', 'Erro');
        }
      }
      this.loadingService.hide();
    });

  }


  openx(data?: EntradasViewerDto) {
    this.isOpen = true;
    this.onClear();
    if (data) {
      this.formData = {
        ...data,
        DataF: this.convertMMYYtoYYYYMM(data.DataF),
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

      const correcaoDto: CorrecaoEntrada = {
         tipo: "CR. CONFERÊNCIA",
        userId: this.wsService.UserCurrent.UserId,
        conferenciaId:this.formData.EntradaId,
        qtd_conferida:this.formData.QtdConferida,
        dataf:this.converterMesAno(this.formData.DataF.toString()),
        semf:this.formData.SemF,
        lote:this.formData.Lote
      };
      this.wsService.send({
        action: 'correcao_entrada',
        data: correcaoDto
      });
      this.loadingService.show();
    }
  }
  onClear() {
    this.formData = {
      EntradaId: 0,
      Tipo: '',
      UserNome: '',
      ProdutoId: 0,
      ProdutoCodigo: '',
      ProdutoDescricao: '',
      QtdConferida: 0,
      QtdEntrada: 0,
      CifsNome: '',
      Lote: '',
      DataF: '',
      SemF: 0,
      CreateAt: new Date,
      UpdateAt: new Date
    }
  }
}
