import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Estoque } from '../../components/estoque/estoque';

@Component({
  selector: 'app-mapa-estoque',
  imports: [MatTabsModule, Estoque],
  templateUrl: './mapa-estoque.html',
  styleUrl: './mapa-estoque.scss'
})
export class MapaEstoque {

}
