import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-descricao',
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>Descrição</h2>
    <mat-dialog-content>
      <p>{{ data.descricao }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    ::ng-deep .descricao-dialog-panel {
      z-index: 9999  !important;
    }

    ::ng-deep .descricao-dialog-panel .mat-dialog-container {
      z-index: 10000 !important;
      position: relative;
    }

    ::ng-deep .cdk-overlay-backdrop {
      z-index: 9998 !important;
    }
    ::ng-deep .cdk-overlay-container {
    z-index: 9999;
}
::ng-deep .descricao-dialog-panel button[mat-dialog-close] {
  background-color: #4caf50 !important;
  color: white !important;
  border-radius: 6px;
  padding: 6px 12px;
}

::ng-deep .descricao-dialog-panel button[mat-dialog-close]:hover {
  background-color: #388e3c !important;
}

  `],
  encapsulation: ViewEncapsulation.None
})
export class DialogDescricaoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { descricao: string }) { }
}