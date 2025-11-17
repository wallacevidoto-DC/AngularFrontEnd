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


@Component({
  selector: 'app-add-produto-entrada-livre',
  imports: [CommonModule, FormsModule, MatIcon, ReactiveFormsModule, BaseModalComponent, LeitorBarcode],
  templateUrl: './add-produto-entrada-livre.html',
  styleUrl: './add-produto-entrada-livre.scss',
})
export class AddProdutoEntradaLivre extends ModalBase implements OnInit {

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

      }
      this.loadingService.hide();
    });
  }

  @Output() submitForm = new EventEmitter<ProdutoSpDto>();

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
    this.formData.codigo =$event.Codigo
  }


  openx() {
    this.isOpen = true;
    this.onClear()

  }
  submitted = false;
  submit(form: NgForm) {
    this.submitted = true;

    if (!this.produto || form.invalid) {
      // mostra erros visuais e não envia nada
      return;
    }

    // this.submitForm.emit({
    //   codigo: this.produto.Codigo,
    //   descricao: this.produto.Descricao,
    //   produtoId: this.produto.ProdutoId,
    //   quantidade: this.formData.quantidade,
    //   dataf: this.converterMesAno(this.formData.dataf.toString()),
    //   semf: this.formData.semf,
    //   lote: this.formData.lote,
    //   propsPST: { isModified: true, origem: Origem.OUT }
    // } as ProdutoSpDto);

    this.loadingService.hide();
    this.onClear();
    this.onCloseBase();
    this.submitted = false;
  }

  // submit() {
  //   if (!this.produto) {
  //     this._snackBar.open('Selecione um produto antes de continuar.', "OK");
  //     return;
  //   }

  //   if (
  //     !this.formData.quantidade ||
  //     !this.formData.dataf ||
  //     !this.formData.lote
  //   ) {
  //     this._snackBar.open('Preencha todos os campos obrigatórios.', "OK");
  //     return;
  //   }

  //   // 🔹 Emite o formulário se estiver tudo OK
  //   this.submitForm.emit({
  //     codigo: this.produto.Codigo,
  //     descricao: this.produto.Descricao,
  //     produtoId: this.produto.ProdutoId,
  //     quantidade: this.formData.quantidade,
  //     dataf: this.converterMesAno(this.formData.dataf.toString()),
  //     semf: this.formData.semf,
  //     lote: this.formData.lote,
  //     propsPST: { isModified: true, origem: Origem.OUT }
  //   } as ProdutoSpDto);

  //   this.loadingService.hide();
  //   this.onClear();
  //   this.onCloseBase();
  // }


  // submit() {
  //   if (this.produto) {
  //     this.submitForm.emit(
  //       {
  //         codigo: this.produto.Codigo,
  //         descricao: this.produto.Descricao,
  //         produtoId: this.produto.ProdutoId,
  //         quantidade: this.formData.quantidade,
  //         dataf: this.converterMesAno(this.formData.dataf.toString()),
  //         semf: this.formData.semf,
  //         lote: this.formData.lote,
  //         propsPST: { isModified: true, origem: Origem.OUT }
  //       } as ProdutoSpDto
  //     );
  //     this.loadingService.hide();
  //     this.onClear();
  //     this.onCloseBase()
  //   }
  // }

  onClear() {
    this.formData = {
      codigo: '',
      quantidade: NaN,
    };

    this.produto = undefined;
  }

}