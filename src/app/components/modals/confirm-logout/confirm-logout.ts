import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-logout',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Sair da Sessão</h2>
    <mat-dialog-content>
      Deseja realmente sair da sessão e voltar para o login?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Não</button>
      <button mat-raised-button color="warn" (click)="onYesClick()">Sim, Sair</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-actions {
      padding-bottom: 16px;
    }
  `]
})
export class ConfirmLogoutModal {
  constructor(public dialogRef: MatDialogRef<ConfirmLogoutModal>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
