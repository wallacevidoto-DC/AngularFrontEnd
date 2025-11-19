import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Estoque } from '../../components/estoque/estoque';
import { Entrada } from "../../components/entrada/entrada";

@Component({
  selector: 'app-mapa-estoque',
  imports: [MatTabsModule, Estoque, Entrada],
  templateUrl: './mapa-estoque.html',
  styleUrl: './mapa-estoque.scss'
})
export class MapaEstoque {

}
