import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LeitorBarcode } from "../../leitor-barcode/leitor-barcode";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { EntradaLivre } from "../../components/entrada-livre/entrada-livre";
import { CifService } from '../../service/cif.service';
import { WebSocketService } from '../../service/ws.service';
import { NgToastService } from 'ng-angular-popup';


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
  imports: [ MatTabsModule, FormsModule, CommonModule, MatListModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatRippleModule, MatButtonModule, RouterModule, EntradaLivre, RouterOutlet],
  templateUrl: './entrada-mercadoria.html',
  styleUrl: './entrada-mercadoria.scss'
})
export class EntradaMercadoria implements OnInit {

  readonly dialog = inject(MatDialog);
  private cifService: CifService = inject(CifService);
  private wsService: WebSocketService = inject(WebSocketService);
  private toastr: NgToastService = inject(NgToastService);

  protected cifId = signal(0);
  protected cifCod = signal<string | null>(null);
  TYPE_IMPUT = TYPE_IMPUT; 

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  protected menu: boolean = true;
  protected tipoEntrada: TYPE_IMPUT = TYPE_IMPUT.NONE

  ngOnInit(): void {}

  isMenuVisible(): boolean {
    return this.router.url === '/entrada-mercadoria';
  }

  cliqueCif() {
    // Verificar se já existe uma sessão de CIF ativa ou produtos no localStorage de CIF
    const cifSalvo = localStorage.getItem('entradaCif');
    const activeCif = this.cifService.currentCif;

    if (activeCif || (cifSalvo && JSON.parse(cifSalvo).length > 0)) {
      // Se já tem dados, vai direto para a rota de CIF sem perguntar
      this.router.navigate(['/entrada-mercadoria/cif']);
    } else {
      // Se não tem nada, abre a modal para digitar a CIF
      this.abrirDialogCIF();
    }
  }

  isCifRoute(): boolean {
    return this.router.url.includes('/entrada-mercadoria/cif');
  }

  abrirDialogCIF() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Validar/Criar CIF via WS
        this.wsService.send({
          action: 'validar_cif',
          data: { cifCod: result.toUpperCase() } 
        });

        // Ouvir a resposta uma única vez
        const sub = this.wsService.messages$.subscribe(msg => {
          if (msg && msg.type === 'validar_cif_resposta') {
            if (msg.status === 'ok') {
              this.cifService.setCif({ cifCod: msg.dados.cifCod, cifId: msg.dados.cifId });
              this.router.navigate(['/entrada-mercadoria/cif']);
            } else {
              this.toastr.danger(msg.mensagem || 'CIF inválida', 'Erro', 10000);
            }
            sub.unsubscribe();
          }
        });
      }
    });
  }
}