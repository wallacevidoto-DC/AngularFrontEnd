import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-descricao',
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title class="gd-title">Descrição</h2>

    <mat-dialog-content class="gd-content">
      <p class="gd-text">{{ data.descricao }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="gd-actions">
      <button class="google-btn"  mat-dialog-close>
        Fechar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    /* Painel do dialog */
    .descricao-dialog-panel .mat-dialog-container {
      padding: 0 !important;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgb(0 0 0 / 20%) !important;
    }

    /* Título - estilo Google */
    .gd-title {
      padding: 24px 24px 0 24px;
      margin: 0;
      font-size: 22px;
      font-weight: 500;
      color: #202124;
      letter-spacing: .2px;
    }

    /* Área de conteúdo */
    .gd-content {
      padding: 16px 24px;
      color: #3c4043;
      font-size: 15px;
      line-height: 1.5;
    }

    .gd-text {
      margin: 0;
    }

    /* Ações */
    .gd-actions {
      padding: 8px 24px 20px 24px;
    }

    .google-btn {
  background-color: #1a73e8; /* Azul Google */
  color: white;
  font-family: "Google Sans", "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  min-width: 80px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0px 1px 2px rgba(0,0,0,0.2);
}

.google-btn:hover {
  background-color: #1669c1; /* Azul mais escuro ao passar */
  box-shadow: 0px 2px 4px rgba(0,0,0,0.3);
}

.google-btn:active {
  background-color: #0f55a0; /* Azul mais escuro ao clicar */
  box-shadow: 0px 1px 2px rgba(0,0,0,0.4);
}

.google-btn:disabled {
  background-color: #c2c2c2;
  color: #6d6d6d;
  cursor: default;
  box-shadow: none;
}

    .descricao-dialog-panel {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 20%);
}



  `],
  encapsulation: ViewEncapsulation.None
})
export class DialogDescricaoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { descricao: string }) { }
}
