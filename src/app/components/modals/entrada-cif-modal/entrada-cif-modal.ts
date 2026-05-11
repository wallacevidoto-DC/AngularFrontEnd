import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalBase, BaseModalComponent } from '../base-modal/base-modal.component';
import { WebSocketService } from '../../../service/ws.service';
import { LoadingService } from '../loading-page/LoadingService.service';
import { NgToastService } from 'ng-angular-popup';
import { EntradasViewerDto } from '../../entrada/index.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CifService } from '../../../service/cif.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entrada-cif-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseModalComponent, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './entrada-cif-modal.html',
  styleUrl: './entrada-cif-modal.scss'
})
export class EntradaCifModal extends ModalBase implements OnInit {

  private wsService: WebSocketService = inject(WebSocketService);
  private loadingService: LoadingService = inject(LoadingService);
  private toastr: NgToastService = inject(NgToastService);
  private cifService: CifService = inject(CifService);

  private sub!: Subscription;

  cifCod: string = '';
  itemSelecionado: EntradasViewerDto | null = null;

  ngOnInit(): void {
    this.sub = this.wsService.messages$.subscribe(data => {
      if (!data) return;

      if (data.type === 'validar_cif_resposta') {
        this.loadingService.hide();

        if (data.status === 'ok') {
          this.toastr.success(data.mensagem, 'Sucesso', 10000);
          
          if (data.dados && data.dados.cifCod) {
            this.cifService.setCif({
              cifCod: data.dados.cifCod,
              cifId: data.dados.cifId
            });
          }

          this.wsService.send({ action: 'get_estoque_entrada' });
          this.onCloseBase();
        }
        else if (data.status === 'nao_encontrado') {
          // CIF não encontrada - perguntar se quer criar
          if (confirm(data.mensagem)) {
            this.criarNovaCif();
          }
        }
        else {
          this.toastr.danger(data.mensagem, 'Erro', 10000);
        }
      }

      if (data.type === 'criar_cif_resposta') {
        this.loadingService.hide();

        if (data.status === 'ok') {
          this.toastr.success(data.mensagem, 'Sucesso', 10000);
          
          if (data.dados && data.dados.cifCod) {
            this.cifService.setCif({
              cifCod: data.dados.cifCod,
              cifId: data.dados.cifId
            });
          }

          this.wsService.send({ action: 'get_estoque_entrada' });
          this.onCloseBase();
        }
        else {
          this.toastr.danger(data.mensagem, 'Erro', 10000);
        }
      }
    });
  }

  openx(item: EntradasViewerDto) {
    this.isOpen = true;
    this.cifCod = item.CifsNome ?? '';
    this.itemSelecionado = item;
  }

  validarCif() {
    if (!this.cifCod || !this.cifCod.trim()) {
      this.toastr.warning('Digite o código CIF.', 'Atenção', 10000);
      return;
    }
    if (!this.itemSelecionado) return;

    this.wsService.send({
      action: 'validar_cif',
      data: {
        cifCod: this.cifCod.trim(),
        entradaId: this.itemSelecionado.EntradaId
      }
    });
    this.loadingService.show();
  }

  criarNovaCif() {
    if (!this.itemSelecionado) return;

    this.wsService.send({
      action: 'criar_cif',
      data: {
        entradaId: this.itemSelecionado.EntradaId
      }
    });
    this.loadingService.show();
  }

  override onCloseBase() {
    this.cifCod = '';
    this.itemSelecionado = null;
    super.onCloseBase();
  }
}
