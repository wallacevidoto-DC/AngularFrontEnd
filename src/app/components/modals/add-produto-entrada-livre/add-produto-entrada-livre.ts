import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatLabel, MatFormField, MatError, MatHint } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { WebSocketService } from '../../../service/ws.service';
import { LoadingService } from '../loading-page/LoadingService.service';
import { ModalBase, BaseModalComponent } from '../base-modal/base-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProdutoSpDto } from '../entrada-modal/index.interface';
import { ProdutoResponse } from '../add-produto-modal/add-produto-modal';
import { LeitorBarcode } from "../../../leitor-barcode/leitor-barcode";


export interface AddProduto {
  codigo: string;
  quantidade: number;
}

export interface RespostaProdutoLivre {
  produto: ProdutoResponse;
  qtd_conferida: number;
  userId?: number;
}

@Component({
  selector: 'app-add-produto-entrada-livre',
  imports: [CommonModule, FormsModule, MatIcon, ReactiveFormsModule, BaseModalComponent, LeitorBarcode],
  templateUrl: './add-produto-entrada-livre.html',
  styleUrl: './add-produto-entrada-livre.scss',
})
export class AddProdutoEntradaLivre extends ModalBase implements OnInit {


  @Output() returnProdOk = new EventEmitter<RespostaProdutoLivre>();


  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private _snackBar = inject(MatSnackBar);
  produto?: ProdutoResponse;
  @ViewChild('formRef') formRef!: NgForm;
  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {
      if (!data) {

        return;
      }


      if (data.type === 'get_produto_resposta') {
        if (data.dados) {

          const novoProduto = data.dados as ProdutoResponse;
          this.produto = novoProduto;
        }
        else {
          this._snackBar.open(data.mensagem, "OK");
        }

      } else if (data.type === 'conferencia_livre_resposta') {
        if (data.dados) { 
          
        }
      }




      this.loadingService.hide();
    });
  }



  openFlag = false;

  formData = {
    quantidade: NaN,
  } as AddProduto;




  buscarProduto() {
    const code = {
      codigo: this.formData.codigo
    };
    this.wsService.send({
      action: 'get_produto',
      data: code
    });
    this.loadingService.show();
  }
  converterMesAno(valor: string): string {
    if (!valor) return '';
    const [ano, mes] = valor.split('-');
    return `${mes}/${ano.slice(2)}`;
  }
  codebar($event: ProdutoResponse) {
    this.produto = $event;
    this.formData.codigo = $event.Codigo
  }


  openx() {
    this.isOpen = true;
    this.onClear()

  }
  submitted = false;
  submit() {
    // this.submitted = true;

    // if (!this.produto || form.invalid || !this.wsService.UserCurrent) {
    //   // mostra erros visuais e não envia nada
    //   return;
    // }

    if (this.wsService.UserCurrent) {


      const model: RespostaProdutoLivre = {
        produto: this.produto,
        qtd_conferida: this.formData.quantidade,
        userId: this.wsService.UserCurrent.UserId,

      } as RespostaProdutoLivre;

      console.log(model);

      this.wsService.send({
        action: 'conferencia_livre',
        data: model
      });
      this.loadingService.show();
    }
  }

  submitx() {
    this.submitted = true;

    // 1) validar formulário Angular
    if (!this.formRef.valid) {
      this._snackBar.open('Preencha todos os campos obrigatórios.', 'OK');
      return;
    }

    // 2) validar produto carregado
    if (!this.produto) {
      this._snackBar.open('Nenhum produto foi selecionado.', 'OK');
      return;
    }

    // 3) validar quantidade numérica
    if (!this.formData.quantidade || this.formData.quantidade <= 0) {
      this._snackBar.open('Informe uma quantidade válida.', 'OK');
      return;
    }

    console.log("this.wsService", this.wsService);

    // 4) validar usuário logado
    if (!this.wsService.UserCurrent) {
      this._snackBar.open('Usuário não identificado.', 'OK');
      return;
    }

    // 5) montar model final
    const model: RespostaProdutoLivre = {
      produto: this.produto,
      qtd_conferida: this.formData.quantidade,
      userId: this.wsService.UserCurrent.UserId
    };

    console.log("✔ Modelo enviado:", model);

    // 6) emite pro pai
    this.returnProdOk.emit(model);

    // 7) se quiser enviar via websocket:
    /*
    this.wsService.send({
      action: 'conferencia_livre',
      data: model
    });
    */

    this.loadingService.show();

    // FECHAR modal
    this.onClear();
    this.onCloseBase();
  }


  onClear() {
    this.formData = {
      codigo: '',
      quantidade: NaN,
    };

    this.produto = undefined;
  }

}