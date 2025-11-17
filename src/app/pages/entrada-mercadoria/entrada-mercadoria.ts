import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LeitorBarcode } from "../../leitor-barcode/leitor-barcode";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


export interface ProdutoResponse {
  ProdutoId: number;
  Codigo: string;
  Descricao: string;
}

export interface EntradaItem extends ProdutoResponse {
  quantidade: number;
}

export enum TYPE_IMPUT {
  NONE, LIVRE, CIF
}



@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
    <h2 mat-dialog-title>CIF</h2>
    <mat-dialog-content>
      <p>Insira o número da CIF</p>
      <mat-form-field>
        <mat-label>Ex: 654x</mat-label>
        <input matInput [(ngModel)]="cif" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button matButton (click)="onNoClick()">Sair</button>
      <button matButton [mat-dialog-close]="cif()" cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<string>(MAT_DIALOG_DATA);
  readonly cif = model(this.data);

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'app-entrada-mercadoria',
  standalone: true, // Adicionado standalone para Angular 15+ se for o caso
  imports: [LeitorBarcode, MatTabsModule, FormsModule, CommonModule, MatListModule, ReactiveFormsModule, MatTabsModule, MatCard, MatIcon, RouterModule],
  templateUrl: './entrada-mercadoria.html',
  styleUrl: './entrada-mercadoria.scss'
})
export class EntradaMercadoria implements OnInit {

  readonly dialog = inject(MatDialog);
  private cifId = signal(0);
  TYPE_IMPUT = TYPE_IMPUT; 
  
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  protected menu: boolean = true;
  protected tipoEntrada: TYPE_IMPUT = TYPE_IMPUT.NONE

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      console.log("Q recebido:", q);
      if (q === 'livre') {
        this.tipoEntrada = TYPE_IMPUT.LIVRE
        this.menu = false;
      }

      else if (q?.startsWith('cif=')) {
        const codigoCif = q.split('=')[1];
        this.tipoEntrada = TYPE_IMPUT.CIF
        this.menu = false;
      }
      else {

        this.menu = true;
        this.tipoEntrada = TYPE_IMPUT.NONE

      }
    });
  }


  abrirDialogCIF() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.cifId.set(result);
        this.router.navigate(['/entrada-mercadoria'], {
          queryParams: { q: `cif=${result}` }
        });
      }
    });
  }
}