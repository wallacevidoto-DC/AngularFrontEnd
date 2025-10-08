import { Component, inject, OnInit, signal } from '@angular/core';
import { Estoque } from "./pages/estoque/estoque";
import { StatusWs } from "./components/status-ws/status-ws";
import { WebSocketService } from './service/ws.service';
import { LoadingPage } from "./components/modals/loading-page/loading-page";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Estoque, StatusWs],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {


  private wsService: WebSocketService = inject(WebSocketService)


  showLoading: boolean = false;


  ngOnInit(): void {
   
    const urlParams = new URLSearchParams(window.location.search);
    const ws_ip = urlParams.get('ws_ip');
    const ws_port = urlParams.get('ws_port');

    if (ws_ip && ws_port) {
      this.wsService.connect(`ws://${ws_ip}:${ws_port}`);
    } else {
      console.error("IP ou porta do WebSocket não encontrados na URL");
    }
    const userStorage = localStorage.getItem('user');
  if (userStorage) {
    const userData = JSON.parse(userStorage);
    const lastLogin = new Date(userData.loginDate);
    const today = new Date();

    
    if (
      lastLogin.getFullYear() === today.getFullYear() &&
      lastLogin.getMonth() === today.getMonth() &&
      lastLogin.getDate() === today.getDate()
    ) {
      this.wsService.UserCurrent = userData.dados;
    } else {
      localStorage.removeItem('user');
    }
  }
  }

  status: string = 'Conectando...';
  protected readonly title = signal('AngularFrontEnd');
}
