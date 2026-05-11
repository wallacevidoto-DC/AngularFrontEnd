import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from "@angular/material/card";
import { AddProdutoEntradaLivre, RespostaProdutoLivre } from '../modals/add-produto-entrada-livre/add-produto-entrada-livre';
import { ItemLista, ListaProdutosLivre } from "../lista-produtos-livre/lista-produtos-livre";
import { CifService } from '../../service/cif.service';

@Component({
  selector: 'app-entrada-cif',
  standalone: true,
  imports: [CommonModule, AddProdutoEntradaLivre, ListaProdutosLivre, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent],
  templateUrl: './entrada-cif.html',
  styleUrl: './entrada-cif.scss',
})
export class EntradaCif implements OnInit {

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private cifService: CifService = inject(CifService);

  meusProdutos: ItemLista[] = [];
  storageKey: string = 'entradaCif';
  cifCod: string | null = null;

  ngOnInit() {
    this.cifService.currentCif$.subscribe(cif => {
      this.cifCod = cif ? cif.cifCod : null;
      this.loadItems();
    });
  }

  loadItems() {
    const salvo = localStorage.getItem(this.storageKey);
    this.meusProdutos = salvo ? JSON.parse(salvo) : [];
    this.cdr.detectChanges();
  }

  onProdutoRetornado($event: RespostaProdutoLivre) {
    if ($event) {
      this.meusProdutos.push({
        codigo: $event.produto.Codigo,
        descricao: $event.produto.Descricao,
        quantidade: $event.qtd_conferida
      });
      localStorage.setItem(this.storageKey, JSON.stringify(this.meusProdutos));
      this.cdr.detectChanges();
    }
  }

  finalizar() {
    localStorage.removeItem(this.storageKey);
    this.cifService.clearCif();
    this.meusProdutos = [];
    this.cdr.detectChanges();
  }
}
