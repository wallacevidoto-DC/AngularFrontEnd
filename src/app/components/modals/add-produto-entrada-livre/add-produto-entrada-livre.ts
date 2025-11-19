import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Inject, OnInit, Output, signal, ViewChild } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';


export interface AddProduto {
  codigo: string;
  quantidade: number;
  dataf: string;
  semf: number;
  lote: string;
}

export interface RespostaProdutoLivre {
  produto: ProdutoResponse;
  qtd_conferida: number;
  userId?: number;
  dataf: string;
  semf: number;
  lote: string;

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
  private toastr: ToastrService = inject(ToastrService);
  private _snackBar = inject(MatSnackBar);


  private model: RespostaProdutoLivre | null = null;
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
        if (data.status === 'ok') {
          this.toastr.success(data.mensagem || 'Operação realizada com sucesso!', 'Sucesso');
          //@ts-ignore
          this.returnProdOk.emit(this.model);
          this.onCloseBase()

        }
        else {
          this.toastr.error(data.mensagem || 'Erro inesperado', 'Erro');
        }
      }
      this.loadingService.hide();
    });
  }



  openFlag = false;

  formData = {
    quantidade: NaN,
    dataf: '',
    lote: '',
    semf: NaN
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

    if (!this.produto ) {
      this._snackBar.open('Nenhum produto encontrado!', 'OK');
      return;
    }
    if (!this.formData.quantidade || this.formData.quantidade <= 0) {
      this._snackBar.open('Informe uma quantidade válida!', 'OK');
      return;
    }
    if (!this.wsService.UserCurrent) {
      this._snackBar.open('Usuário não autenticado!', 'OK');
      return;
    }

    if (this.wsService.UserCurrent) {


      this.model = {
        produto: this.produto,
        qtd_conferida: this.formData.quantidade,
        userId: this.wsService.UserCurrent.UserId,
        dataf:this.converterMesAno(this.formData.dataf.toString()),
        semf: this.formData.semf,
        lote: this.formData.lote


      } as RespostaProdutoLivre;
      this.wsService.send({
        action: 'conferencia_livre',
        data: this.model
      });
      this.loadingService.show();
    }
  }


  onClear() {
    this.formData = {
      codigo: '',
      quantidade: NaN,
      dataf: '',
      lote: '',
      semf: NaN
    };
    this.model = null;
    this.produto = undefined;
  }

}