import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ModalBase, BaseModalComponent } from '../base-modal/base-modal.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OperationSelect } from './index.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-select-operation',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    BaseModalComponent
],
  templateUrl: './select-operation.html',
  styleUrl: './select-operation.scss',
})
export class SelectOperation extends ModalBase implements OnInit {

  private toastr = inject(ToastrService);

  @Input() isDefault: boolean = true;
  @Output() returnSelect = new EventEmitter<OperationSelect>();

  quantidade: number = 1;
  tipoSelecionado: 'PICKING' | 'COMUM' | null = null;

  ngOnInit(): void {
    this.tipoSelecionado = null;
  }

  // garante reset sempre que o modal abrir
  override onOpenBase(): void {
    super.onOpenBase();
    this.tipoSelecionado = null;
    this.quantidade = 1;
  }

  // usado pelos botões
  selecionarTipo(tipo: 'PICKING' | 'COMUM') {
    this.tipoSelecionado = tipo;

    // valida quantidade
    if (!this.quantidade || this.quantidade <= 0) {
      this.toastr.warning("A quantidade deve ser maior que 0", "Alerta");
      return;
    }

    const resultado: OperationSelect = {
      op: tipo,
      quantidade: this.quantidade
    };

    this.returnSelect.emit(resultado);
    this.tipoSelecionado = null;
    this.quantidade = 1;
    this.onCloseBase();
  }
}
