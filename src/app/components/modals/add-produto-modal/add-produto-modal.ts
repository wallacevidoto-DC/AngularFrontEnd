import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BaseModalComponent, ModalBase } from "../base-modal/base-modal.component";
import { WebSocketService } from '../../../service/ws.service';
import { MatIconModule } from '@angular/material/icon'
import { LoadingService } from '../loading-page/LoadingService.service';
import { Origem, ProdutoSpDto } from '../entrada-modal/index.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface AddProduto {
  codigo: string;
  quantidade: number;
  dataf: string;
  semf: number;
  lote: string;
}

export interface SaidaFormDataOut {
  estoqueId: number
  fardo: number;
  quantidade: number;
  quebra: number;
  observacao: string;
}


interface ProdutoResponse {
  ProdutoId: number
  Codigo: string
  Descricao: string
}

@Component({
  selector: 'app-add-produto-modall',
  imports: [CommonModule, FormsModule, BaseModalComponent, MatIconModule, MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './add-produto-modal.html',
  styleUrl: './add-produto-modal.scss'
})
export class AddProdutoModal extends ModalBase implements OnInit {

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private _snackBar = inject(MatSnackBar);
  produto?: ProdutoResponse;
  @ViewChild('formRef') formRef!: NgForm;
  ngOnInit(): void {

    this.wsService.messages$.subscribe(data => {

      if (!data) return;

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
    // dataf: '',
    semf: NaN,
    lote: '',
  } as AddProduto;

  openx() {
    this.isOpen = true;
    this.onClear()

  }



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


  submitted = false;
  submit(form: NgForm) {
    this.submitted = true;

    if (!this.produto || form.invalid) {
      // mostra erros visuais e não envia nada
      return;
    }

    // Se passou na validação:
    this.submitForm.emit({
      codigo: this.produto.Codigo,
      descricao: this.produto.Descricao,
      produtoId: this.produto.ProdutoId,
      quantidade: this.formData.quantidade,
      dataf: this.converterMesAno(this.formData.dataf.toString()),
      semf: this.formData.semf,
      lote: this.formData.lote,
      propsPST: { isModified: true, origem: Origem.OUT }
    } as ProdutoSpDto);

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
      dataf: '',
      lote: '',
      quantidade: NaN,
      semf: NaN
    };

    this.produto = undefined;
  }

}
