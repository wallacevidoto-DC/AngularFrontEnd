import { CommonModule } from '@angular/common';
import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-base-modal',
  standalone: true,
  imports: [CommonModule,MatIcon],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss',

})
export class BaseModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Título do Modal';
  @Input() icon = 'info';

  @Output() closeModal = new EventEmitter<void>();
  @Output() openModal = new EventEmitter<void>();


  ngOnChanges() {
  if (this.isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}

  onClose() {
    this.isOpen = false;
    this.closeModal.emit();
  }
  onOpen(){
    this.isOpen = true;
    this.openModal.emit();
  }
}


@Directive()
export abstract class ModalBase {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() open = new EventEmitter<void>();

  onOpenBase() {
  this.isOpen = true;
  this.open.emit();
}

onCloseBase() {
  this.isOpen = false;
  this.close.emit();
}
}


