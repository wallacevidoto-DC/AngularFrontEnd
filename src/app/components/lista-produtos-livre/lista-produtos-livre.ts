import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';


export interface ItemLista {
  codigo: string | number;
  descricao: string;
  quantidade: number;
}



@Component({
  selector: 'app-lista-produtos-livre',
    standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './lista-produtos-livre.html',
  styleUrl: './lista-produtos-livre.scss',
})
export class ListaProdutosLivre {
  @Input() items: ItemLista[] = [];

  displayed = ['codigo', 'descricao', 'quantidade'];
}
