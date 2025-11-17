import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProdutoEntradaLivre } from '../modals/add-produto-entrada-livre/add-produto-entrada-livre';

@Component({
  selector: 'app-entrada-livre',
  standalone: true,
  imports: [AddProdutoEntradaLivre],
  templateUrl: './entrada-livre.html',
  styleUrl: './entrada-livre.scss',
})
export class EntradaLivre {


  constructor(private dialog: MatDialog) { }

 openProductDialog(): void {
    const dialogRef = this.dialog.open(AddProdutoEntradaLivre, {
      width: '400px', // Define a largura padrão para diálogos
      // Você pode passar dados para a modal aqui, se necessário: data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('A modal foi fechada', result);
      var c = result || null;
      console.log("c:=>",c);
      
    });
  }
}
