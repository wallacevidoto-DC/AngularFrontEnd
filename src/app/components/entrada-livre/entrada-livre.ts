import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProdutoEntradaLivre, RespostaProdutoLivre } from '../modals/add-produto-entrada-livre/add-produto-entrada-livre';
import { ItemLista, ListaProdutosLivre } from "../lista-produtos-livre/lista-produtos-livre";
import { MatIcon } from "@angular/material/icon";
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from "@angular/material/card";

@Component({
  selector: 'app-entrada-livre',
  standalone: true,
  imports: [AddProdutoEntradaLivre, ListaProdutosLivre, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent],
  templateUrl: './entrada-livre.html',
  styleUrl: './entrada-livre.scss',
})
export class EntradaLivre implements OnInit{

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef)

  meusProdutos: ItemLista[] = [];


  ngOnInit() {
    const salvo = localStorage.getItem('entradaLivre');
    if (salvo) {
      this.meusProdutos = JSON.parse(salvo);
    }
  } 

  onProdutoRetornado($event: RespostaProdutoLivre) {
    console.log('$event', $event);

    if ($event) {
      this.meusProdutos.push({
        codigo: $event.produto.Codigo,
        descricao: $event.produto.Descricao,
        quantidade: $event.qtd_conferida
      });
      localStorage.setItem('entradaLivre', JSON.stringify(this.meusProdutos));
      this.cdr.detectChanges();
    }

    console.log("meusProdutos", this.meusProdutos);

  }
  finalizar() {
  localStorage.removeItem('entradaLivre');
  this.meusProdutos = [];
  this.cdr.detectChanges();
}

}