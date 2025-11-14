import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../service/ws.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../modals/loading-page/LoadingService.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-status-ws',
  imports: [CommonModule],
  templateUrl: './status-ws.html',
  styleUrl: './status-ws.scss'
})
export class StatusWs implements OnInit, OnDestroy {
  private ws = inject(WebSocketService);
  private sub!: Subscription;
  private loadingService: LoadingService = inject(LoadingService)
  private toastr: ToastrService = inject(ToastrService);
  status: string = 'Desconectado';

  ngOnInit() {
    this.sub = this.ws.status$.subscribe(st => {
      this.status = st;

    });

    // this.ws.messages$.subscribe(data => {
    //   if (!data) { this.loadingService.hide(); 
    //     this.toastr.error(data || 'Erro inesperado', 'Erro');
    //   }
    // })




  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
