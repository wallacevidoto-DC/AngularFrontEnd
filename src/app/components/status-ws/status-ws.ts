import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../service/ws.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-ws',
  imports: [CommonModule],
  templateUrl: './status-ws.html',
  styleUrl: './status-ws.scss'
})
export class StatusWs implements OnInit, OnDestroy {
  private ws = inject(WebSocketService);
  private sub!: Subscription;

  status: string = 'Desconectado';

  ngOnInit() {
    this.sub = this.ws.status$.subscribe(st => {
      this.status = st;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
