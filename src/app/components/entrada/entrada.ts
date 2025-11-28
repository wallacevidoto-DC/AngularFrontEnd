import { Component, EventEmitter, OnInit, Output, NgZone, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';;
import { WebSocketService } from '../../service/ws.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
import { LoadingPage } from "../modals/loading-page/loading-page";
import { LoadingService } from '../modals/loading-page/LoadingService.service';
import { MatCardActions, MatCardContent, MatCardSubtitle, MatCardHeader, MatCardTitle, MatCard } from "@angular/material/card";
import { EntradasViewerDto } from './index.interface';
import { RouterModule } from '@angular/router';
import { EntradaConferenciaCorrecaoModal } from '../modals/entrada-conferencia_correcao-modal/entrada-conferencia_correcao-modal';
import { EntradaConferenciaModal } from "../modals/entrada-conferencia-modal/entrada-modal";
import { SelectOperation } from "../modals/select-operation/select-operation";
import { OperationSelect } from '../modals/select-operation/index.interface';
import { EntradaPickingModal } from "../modals/entrada-picking-modal/entrada-picking-modal";

@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, RouterModule, MatIconModule, LoadingPage, MatCardActions, MatCardContent, MatCardSubtitle, MatCardHeader, MatCardTitle, MatCard, EntradaConferenciaCorrecaoModal, EntradaConferenciaModal, SelectOperation, EntradaPickingModal],
  templateUrl: './entrada.html',
  styleUrl: './entrada.scss'
})
export class Entrada implements OnInit {
  @Output() statusChange = new EventEmitter<string>();

  
  @ViewChild('selectOP') selectOP!: any;
  @ViewChild('entradaModal') entradaModal!: any;
  @ViewChild('pickingModal') pickingModal!: any;
  
  dadosEstoque: EntradasViewerDto[] = [];
  itemSelecionado: EntradasViewerDto|null = null;

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

      if (!data) return

      if (data.type === 'get_estoque_entrada_resposta') {
        const lista = data.dados;
        this.dadosEstoque = Array.isArray(lista) ? lista : [];
        this.loadingService.hide();
        console.log('lista', lista);

      }
      else if (data.type === 'remove_estoque_entrada_resposta') {
        this.wsService.send({ action: 'get_estoque_entrada' });
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


  remover(ent: EntradasViewerDto) {
    if (confirm('Deseja deletar esse item')) {
      this.wsService.send({ action: 'remove_estoque_entrada', data: ent });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAbrirSelect(item: any) {
    this.itemSelecionado = item;
    this.selectOP.isOpen = true;
  }

  // RECEBE PICKING ou COMUM
  returnSelect($event:OperationSelect) {
    if (!$event.op || !this.itemSelecionado) return;

    if ($event.op === 'PICKING') {
      // this.itemSelecionado.QtdConferida = $event.quantidade
      this.pickingModal.openx({
        ...this.itemSelecionado,
        QtdConferida:$event.quantidade
      });
         
    }

    if ($event.op === 'COMUM') {
      // this.itemSelecionado.QtdConferida = $event.quantidade
      this.entradaModal.openx({
        ...this.itemSelecionado,
        QtdConferida:$event.quantidade
      });
    }

    // limpa depois de usar
    this.itemSelecionado = null;
  }

}
