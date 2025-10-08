import { Component, EventEmitter, OnInit, Output, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntradaModal } from '../../components/modals/entrada-modal/entrada-modal';
import { SaidaModal } from '../../components/modals/saida-modal/saida-modal';
import { TransferenciaModal } from '../../components/modals/transferencia-modal/transferencia-modal';
import { CorrecaoModal } from '../../components/modals/correcao-modal/correcao-modal';
import { WebSocketService } from '../../service/ws.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { LoginModalComponent } from '../../components/modals/login/login';
import { MatDialog } from '@angular/material/dialog';
import { LoadingPage } from "../../components/modals/loading-page/loading-page";
import { LoadingService } from '../../components/modals/loading-page/LoadingService.service';


export interface EstoqueItem {
  estoqueId: number;
  enderecoId: string;
  codigo: string;
  descricao: string;
  produto: string;
  modelo?: string;
  fardo: number;
  quantidade: number;
  quebra: number;
  date_in: string;
  updates:string,
  obs:string
}

@Component({
  selector: 'app-estoque',
  imports: [EntradaModal, CommonModule,
    FormsModule,
    SaidaModal,
    TransferenciaModal,
    CorrecaoModal, MatButtonModule,
    MatIconModule, LoadingPage],
  templateUrl: './estoque.html',
  styleUrl: './estoque.scss'
})
export class Estoque implements OnInit {

  @Output() statusChange = new EventEmitter<string>();

  dadosEstoque: EstoqueItem[] = [];
  filtroColuna = 'enderecoId';
  entradaPesquisa = '';
  showBtnTopo = false;

  private zone: NgZone = inject(NgZone)
  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private dialog: MatDialog = inject(MatDialog);

  ngOnInit() {
 

    this.wsService.status$.subscribe(status => {
      if (status === 'Conectado') {
        this.wsService.send({ action: 'get_estoque' });
        this.loadingService.show();
      }
    });
    this.wsService.messages$.subscribe(data => {
      if (data && data.type === 'estoque') {
        const lista = data.produtos ?? data.dados;
        this.dadosEstoque = Array.isArray(lista) ? lista : [];
        this.loadingService.hide();
      }

    });

    window.addEventListener('scroll', () => {
      this.zone.run(() => {
        this.showBtnTopo = window.scrollY > 200;
      });
    });


    this.openLogin()

  }

  openLogin() {

    if (this.wsService.UserCurrent) {
      return
    }
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // console.log('Login aprovado!',this.wsService.UserCurrent);
      } else {
        window.location.reload();
      }
    });
  }

  get filtrados(): EstoqueItem[] {
    return this.dadosEstoque.filter(item =>
      String((item as any)[this.filtroColuna] ?? '').toLowerCase().includes(this.entradaPesquisa.toLowerCase())
    );
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
