import { Component, inject, OnInit, signal } from '@angular/core'; // Componente principal
import { NgToastModule } from 'ng-angular-popup';
import { StatusWs } from "./components/status-ws/status-ws";
import { WebSocketService } from './service/ws.service';
import { LoadingPage } from "./components/modals/loading-page/loading-page";
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { LsWebSocket } from './interface/websocket.interface';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from './components/modals/login/login';
import { ConfirmLogoutModal } from './components/modals/confirm-logout/confirm-logout';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StatusWs, LoadingPage, RouterOutlet, NgToastModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {


  private wsService: WebSocketService = inject(WebSocketService)
  private dialog: MatDialog = inject(MatDialog);
  private router: Router = inject(Router);

  isHome: boolean = true;
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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHome = event.urlAfterRedirects === '/home' || event.urlAfterRedirects === '/';
    });

    this.isHome = this.router.url === '/home' || this.router.url === '/';

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
      } else {
        window.location.reload();
      }
    });
  }
  status: string = 'Conectando...';
  protected readonly title = signal('MAPA DE ESTOQUE');

  goHome() {
    this.router.navigate(['/home']);
  }

  onStatusClick() {
    const dialogRef = this.dialog.open(ConfirmLogoutModal, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }

  private logout() {
    localStorage.removeItem('active_cif');
    localStorage.removeItem('entradaCif');
    localStorage.removeItem('entradaLivre');
    localStorage.removeItem('user');
    
    // Reset user state in service
    this.wsService.UserCurrent = null;
    
    // Redirect to login or reload
    window.location.reload(); 
  }
}
