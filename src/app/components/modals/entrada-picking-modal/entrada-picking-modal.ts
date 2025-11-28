import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalBase, BaseModalComponent } from '../base-modal/base-modal.component';
import { WebSocketService } from '../../../service/ws.service';
import { AddProduto, AddProdutoModal } from '../add-produto-modal/add-produto-modal';
import { MatIconModule } from '@angular/material/icon'
import { States } from '../transferencia-modal/transferencia-modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogDescricaoComponent } from '../dialog-descricao/dialog-descricao';
import { LoadingService } from '../loading-page/LoadingService.service';
import { EntradaDto, Origem, ProdutoSpDto, PropsPST, ResponseGetAddress } from './index.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { EntradasViewerDto } from '../../entrada/index.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entrada-picking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseModalComponent, MatIconModule, MatTooltipModule, MatSnackBarModule, AddProdutoModal],
  templateUrl: './entrada-picking-modal.html',
  styleUrl: './entrada-picking-modal.scss'
})
export class EntradaPickingModal extends ModalBase implements OnInit {

  @Input() itemData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  private wsService: WebSocketService = inject(WebSocketService)
  private loadingService: LoadingService = inject(LoadingService)
  private toastr: ToastrService = inject(ToastrService);
  private _snackBar = inject(MatSnackBar);
  protected OpenSub: boolean = true;

  private sub!: Subscription;

  public WT = Origem;
  public Origem = Origem;
  tooltipDisabled = true;
  produtos: ProdutoSpDto[] = []
  public States = States;
  temProdutosIn: States = States.NONE;
  rua: string = '';
  bloco: string = '';
  apt: string = '';
  EntradaId?: number;
  observacao: string = '';


  ngOnInit(): void {

    this.sub = this.wsService.messages$.subscribe(data => {

      if (!data) return;

       if (data.type === 'picking_resposta') {

        if (data.status === 'ok') {
          this.toastr.success(data.mensagem || 'Operação realizada com sucesso!', 'Sucesso');
          this.wsService.send({ action: 'get_estoque' });
          this.wsService.send({ action: 'get_estoque_entrada' });
          console.log('fechadno');
          
          this.onCloseBase()
          
        }
        else {
          this.toastr.error(data.mensagem || 'Erro inesperado', 'Erro');
        }
      }
      this.loadingService.hide();
    });

  }
  private dialog: MatDialog = inject(MatDialog)

  openx(itemData: EntradasViewerDto) {
    this.isOpen = true;
    this.onClear();
    this.EntradaId = itemData.EntradaId;

    this.produtos.push({
      codigo: itemData.ProdutoCodigo,
      descricao: itemData.ProdutoDescricao,
      dataf: itemData.DataF,
      semf: itemData.SemF,
      lote: itemData.Lote,
      produtoId: itemData.ProdutoId,
      quantidade: itemData.QtdConferida,
      propsPST: {
        isModified: false,
        origem: Origem.OUT
      }
    })
  }

  existWTIN(): Boolean {
    return this.produtos.some(p => p.propsPST.origem === this.WT.IN);
  }

  getProdutosFiltrados(): ProdutoSpDto[] {
    return this.produtos.filter(p => p.propsPST.origem === this.WT.IN);
  }

  getAddress() {

    if (!this.rua || !this.bloco || !this.apt) {
      alert('Preencha todos os campos antes de continuar.');
      return;
    }
    const add = {
      rua: this.rua,
      bloco: this.bloco,
      apt: this.apt
    };

    this.wsService.send({
      action: 'get_address',
      data: add
    });
    this.loadingService.show();
  }

  submitE() {    

    if (this.wsService.UserCurrent) {
      const produtoInsert = this.produtos.filter(p => p.propsPST.origem === Origem.OUT);

      if (produtoInsert.length <= 0) {
        this.toastr.warning('Adicione ao menos um produto.');
        return
      }
      const movimentacaoDto: EntradaDto = {
        userId: this.wsService.UserCurrent.UserId,
        dataEntrada: new Date(),
        rua: this.rua,
        bloco: this.bloco,
        apt: this.apt,
        observacao: this.observacao,
        produtos: produtoInsert,
        //@ts-ignore
        EntradaId: this.EntradaId
      };

      this.wsService.send({
        action: 'picking',
        data: movimentacaoDto
      });
      this.loadingService.show();
    }

  }

  enviar($event: ProdutoSpDto) {
    if ($event) {
      this.produtos.push($event)
    }
  }

  onClear() {
    this.produtos = [];
    this.temProdutosIn = States.NONE;

    this.rua = '';
    this.bloco = '';
    this.apt = '';
    this.observacao = '';
  }
  showTooltip() {
    this.tooltipDisabled = false;
    setTimeout(() => this.tooltipDisabled = true, 2000);
  }

  mostrarDescricao(item: ProdutoSpDto) {
    this.dialog.open(DialogDescricaoComponent, {
      data: { descricao: item.descricao },
      panelClass: 'descricao-dialog-panel',
      hasBackdrop: true
    });
  }

  deletarItem(item: ProdutoSpDto) {
    // if (item.wt === WT.OUT) {
    //   this.produtos = this.produtos.filter(p => p !== item);
    // }
  }
} 
