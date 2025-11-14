import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, inject, EventEmitter, Output } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { WebSocketService } from '../service/ws.service';
import { ProdutoResponse } from '../components/modals/add-produto-modal/add-produto-modal';
import { MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-leitor-barcode',
  templateUrl: './leitor-barcode.html',
  styleUrls: ['./leitor-barcode.scss'],
  imports: [],
})
export class LeitorBarcode implements OnInit {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  @Output() produtoEncontrado = new EventEmitter<ProdutoResponse>();

  private wsService: WebSocketService = inject(WebSocketService)


  ngOnInit(): void {

    this.wsService.messages$.subscribe(async data => {

      if (!data) return;

      if (data.type === 'get_produto_resposta') {
        if (data.dados) {

          const novoProduto = data.dados as ProdutoResponse;
          this.produtoEncontrado.emit(novoProduto);
        }

      }
    });
  }


  private reader = new BrowserMultiFormatReader();
  private stream: MediaStream | null = null;

  scanning = false;
  viewReady = false;
  lastScan: string | null = null;

  openModal() {
    this.scanning = true;
    // this.viewReady = false;
    setTimeout(() => {
      // Verifica se o elemento de vídeo foi realmente carregado
      if (this.video) {
        this.iniciarCamera();
      } else {
        console.error("Erro: Elemento de vídeo não encontrado no DOM.");
      }
    }, 0);
  }

  closeModal() {
    this.stop();
  }

  private async iniciarCamera() {
    try {
      this.lastScan = null;

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      const videoEl = this.video.nativeElement;
      videoEl.srcObject = this.stream;

      await videoEl.play();

      this.reader.decodeFromStream(
        this.stream,
        videoEl,
        (result) => {
          if (result) {
            const code = result.getText();

            if (code !== this.lastScan) {
              this.lastScan = code;
              this.closeModal();

              const codews = {
                codigo: code
              };
              this.wsService.send({
                action: 'get_produto_cod',
                data: codews
              });
            }
          }
        }
      );

    } catch (e) {
      console.error("Erro ao acessar câmera:", e);
      alert("Erro ao acessar a câmera.");
    }
  }

  stop() {
    this.scanning = false;
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
  }
}
