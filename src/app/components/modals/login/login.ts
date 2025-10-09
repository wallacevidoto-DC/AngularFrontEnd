import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../service/ws.service';
import { LoadingService } from '../loading-page/LoadingService.service';


export interface User {
  userId: number;
  name: string;
  password?: string;
  create_at: string;
}

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Login</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Usuário</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput type="password" formControlName="password" required>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <!-- <button mat-button mat-dialog-close>Cancelar</button> -->
        <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">Login</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class LoginModalComponent implements OnInit {
  loginForm: FormGroup;
  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginModalComponent>
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

      if (data.type === 'login_resposta') {
        if (data.status === 'ok') {
          const userData = {
            dados: data.dados,
            loginDate: new Date().toISOString() 
          };
          localStorage.setItem('user', JSON.stringify(userData));

          this.wsService.UserCurrent = data.dados;
          this.loadingService.hide();
          this.dialogRef.close(true);
        }
        else {
          this.loadingService.hide();
          alert(data.mensagem)
        }
      }
    });

  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      const datas = {
        action: 'login',
        data: {
          username,
          password
        }
      };
      this.wsService.send(datas);
      this.loadingService.show();
    }
  }
}



