import { Component, inject, OnInit } from '@angular/core';
import { WebSocketService } from '../../service/ws.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../modals/login/login';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatCardModule, DragDropModule, MatIconModule, RouterModule,],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {


}
