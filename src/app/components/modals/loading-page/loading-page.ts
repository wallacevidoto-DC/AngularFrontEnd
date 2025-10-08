import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingService } from './LoadingService.service';

@Component({
  selector: 'app-loading-page',
  imports: [CommonModule],
  templateUrl: './loading-page.html',
  styleUrl: './loading-page.scss'
})
export class LoadingPage {
  private loadingService: LoadingService = inject(LoadingService)

  loading$ = this.loadingService.loading$;
  boxes = Array(5); // número de "baixas" empilhadas

}
