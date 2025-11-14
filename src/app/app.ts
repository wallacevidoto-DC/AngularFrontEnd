import { Component, inject, OnInit, signal } from '@angular/core';
import { StatusWs } from "./components/status-ws/status-ws";
import { WebSocketService } from './service/ws.service';
import { LoadingPage } from "./components/modals/loading-page/loading-page";
import { RouterOutlet } from '@angular/router';
import { LsWebSocket } from './interface/websocket.interface';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from './components/modals/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StatusWs, LoadingPage, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {


  private wsService: WebSocketService = inject(WebSocketService)
  private dialog: MatDialog = inject(MatDialog);

  showLoading: boolean = false;

  ngOnInit(): void {

    const wsRaw = localStorage.getItem("acessWebSocket");
    const wsSave: LsWebSocket | null = wsRaw ? JSON.parse(wsRaw) as LsWebSocket : null;

    let ws_ip: string|null;
    let ws_port: string|null;

    if (wsSave) {
      ws_ip = wsSave.ip;
      ws_port = wsSave.port;
    }
    else {
      const urlParams = new URLSearchParams(window.location.search);
      ws_ip = urlParams.get('ws_ip');
      ws_port = urlParams.get('ws_port');
    }


    if (ws_ip && ws_port) {
      this.wsService.connect(`wss://${ws_ip}:${ws_port}`);
    } else {
      console.error("IP ou porta do WebSocket não encontrados na URL");
    }


    if (ws_ip && ws_port) {
      const acessWebSocket: LsWebSocket = { ip: ws_ip, port: ws_port };
      localStorage.setItem('acessWebSocket', JSON.stringify(acessWebSocket));
    }
    const userStorage = localStorage.getItem('user');

    if (userStorage) {
      const userData = JSON.parse(userStorage);

      const lastLogin = new Date(userData.loginDate);
      const today = new Date();

      const isSameDay = lastLogin.toDateString() === today.toDateString();

      if (isSameDay) {
        this.wsService.UserCurrent = userData.dados;

      } else {
        localStorage.removeItem('user');
      }
    }
    // this.openLogin()
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
      } else {
        window.location.reload();
      }
    });
  }
  status: string = 'Conectando...';
  protected readonly title = signal('MAPA DE ESTOQUE');
}
