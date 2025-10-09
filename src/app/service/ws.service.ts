import os from '@angular/common/locales/os';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../components/modals/login/login';

@Injectable({
  providedIn: 'root' // garante singleton
})
export class WebSocketService {
  private socket!: WebSocket;
  private zone: NgZone;

  private _status = new BehaviorSubject<string>('Desconectado');
  private _messages = new BehaviorSubject<any>(null);

  private isConnected = false;

  private reconnectTimeout: any;
  private wsCurrent!:string;

  constructor(zone: NgZone) {
    this.zone = zone;
  }


  UserCurrent: User|null = null;
  
  reconnect(){
    if (this.wsCurrent) {
      this.connect(this.wsCurrent)
    }
  }
  connect(ws:string) {
    if (this.isConnected) return;
    this.wsCurrent = ws;   
    
    this.socket = new WebSocket(this.wsCurrent);

    this.socket.onopen = () => {
      this.zone.run(() => {
        console.log('🔗 Conectado ao servidor WebSocket');
        this._status.next('Conectado');
        this.isConnected = true;
      });
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.zone.run(() => this._messages.next(data));
    };

    this.socket.onerror = (err) => this.zone.run(() => this._status.next('Erro de Conexão'));
    this.socket.onclose = this.handleClose;
   
   
  }

  disconnect() {
    clearTimeout(this.reconnectTimeout);
    if (this.socket) {
      this.socket.close();
    }
    this.isConnected = false;
    this._status.next('Desconectado');
  }

  get status$(): Observable<string> {
    return this._status.asObservable();
  }

  get messages$(): Observable<any> {
    return this._messages.asObservable();
  }

  send(dados: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(dados));
    } else {
      console.warn('WebSocket não está aberto');
    }
  }

  private handleClose = () => {
    this.zone.run(() => {
      console.log('🔌 Conexão perdida, tentando reconectar...');
      this._status.next('Reconectando');
      this.isConnected = false;

      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(() => {
        this.reconnect();
      }, 3000);
    });
  };
}
