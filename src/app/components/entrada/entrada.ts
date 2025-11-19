import { Component, EventEmitter, OnInit, Output, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntradaModal } from '../modals/entrada-modal/entrada-modal';
import { SaidaModal } from '../modals/saida-modal/saida-modal';
import { TransferenciaModal } from '../modals/transferencia-modal/transferencia-modal';
import { CorrecaoModal } from '../modals/correcao-modal/correcao-modal';
import { WebSocketService } from '../../service/ws.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
import { LoadingPage } from "../modals/loading-page/loading-page";
import { LoadingService } from '../modals/loading-page/LoadingService.service';
import { MatCardActions, MatCardContent, MatCardSubtitle, MatCardHeader, MatCardTitle, MatCard } from "@angular/material/card";
import { EntradasViewerDto } from './index.interface';
import { EntradaConferenciaModal } from "../modals/entrada-conferencia-modal/entrada-modal";

@Component({
  selector: 'app-entrada',
  imports: [EntradaModal, CommonModule,
    FormsModule,
    SaidaModal,
    TransferenciaModal,
    CorrecaoModal, MatButtonModule,
    MatIconModule, LoadingPage, MatCardActions, MatCardContent, MatCardSubtitle, MatCardHeader, MatCardTitle, MatCard, EntradaConferenciaModal],
  templateUrl: './entrada.html',
  styleUrl: './entrada.scss'
})
export class Entrada implements OnInit {

  @Output() statusChange = new EventEmitter<string>();

  dadosEstoque: EntradasViewerDto[] = [];
  filtroColuna = 'codigo';
  entradaPesquisa = '';
  showBtnTopo = false;

  private zone: NgZone = inject(NgZone)
  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private dialog: MatDialog = inject(MatDialog);

  ngOnInit() {
    this.wsService.status$.subscribe(status => {
      if (status === 'Conectado') {
        this.wsService.send({ action: 'get_estoque_entrada' });
        this.loadingService.show();
      }
    });
    this.wsService.messages$.subscribe(data => {

      if(!data) return

      if (data.type === 'get_estoque_entrada_resposta') {
        const lista = data.dados;
        this.dadosEstoque = Array.isArray(lista) ? lista : [];
        this.loadingService.hide();
        console.log('lista',lista);
        
      }

    });

    window.addEventListener('scroll', () => {
      this.zone.run(() => {
        this.showBtnTopo = window.scrollY > 200;
      });
    });
  }

  get filtrados(): EntradasViewerDto[] {
    return this.dadosEstoque.filter(item => {
      let valor: string = '';

      if (this.filtroColuna === 'codigo' && item.ProdutoCodigo) {
        valor = item.ProdutoCodigo;
      } else if (this.filtroColuna === 'descricao' && item.ProdutoDescricao) {
        valor = item.ProdutoDescricao;
      } else {
        valor = String((item as any)[this.filtroColuna] ?? '');
      }

      return valor.toLowerCase().includes(this.entradaPesquisa.toLowerCase());
    });
  }




  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // enviar(dados: any) {
  //   if (this.socket && this.socket.readyState === WebSocket.OPEN) {

  //     this.socket.send(JSON.stringify(dados));
  //   }
  // }

  enviar(dados: any) {
    // this.wsService.send(dados);
  }
}
