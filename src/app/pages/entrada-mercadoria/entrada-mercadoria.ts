import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Estoque } from "../../components/estoque/estoque"; // Assumindo que você usa este tipo/componente
import { LeitorBarcode } from "../../leitor-barcode/leitor-barcode";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


export interface ProdutoResponse {
  ProdutoId: number; // ⬅️ O campo que estava faltando no LeitorBarcode
  Codigo: string;
  Descricao: string;
  // Adicione todos os outros campos que seu produto possui
}

// Interface para o produto na lista de entrada
export interface EntradaItem extends ProdutoResponse {
  quantidade: number;
}

@Component({
  selector: 'app-entrada-mercadoria',
  standalone: true, // Adicionado standalone para Angular 15+ se for o caso
  imports: [LeitorBarcode, MatTabsModule,
    FormsModule, // ⬅️ Adicione FormsModule
    CommonModule // ⬅️ Adicione CommonModule
  ], // MatTabsModule para o futuro, se necessário
  templateUrl: './entrada-mercadoria.html',
  styleUrl: './entrada-mercadoria.scss'
})
export class EntradaMercadoria {
  // Lista dos produtos que estão sendo dados entrada
  produtosEntrada: EntradaItem[] = [];
  
  // Variável para permitir a entrada manual do código, se desejado
  codigoManual: string = '';

  /**
   * Adiciona o produto retornado pelo leitor de código de barras (ou digitação)
   * à lista de entrada.
   * @param produto O objeto ProdutoResponse retornado pelo servidor.
   */
  adicionarProduto(produto: ProdutoResponse) {
    // Verifica se o produto já está na lista
    const itemExistente = this.produtosEntrada.find(item => item.Codigo === produto.Codigo);

    if (itemExistente) {
      // Se existir, apenas incrementa a quantidade
      itemExistente.quantidade++;
      // alert(`Produto ${produto.Descricao} (Cód: ${produto.Codigo}) já estava na lista. Quantidade atualizada para ${itemExistente.quantidade}.`);
    } else {
      // Se não existir, adiciona como novo item (quantidade inicial = 1)
      this.produtosEntrada.push({
        ...produto,
        quantidade: 1
      });
      // alert(`Produto ${produto.Descricao} (Cód: ${produto.Codigo}) adicionado à lista.`);
    }
  }
  
  /**
   * Envia o código digitado para buscar o produto, simulando o escaneamento.
   */
  buscarProdutoManual() {
    if (this.codigoManual.trim()) {
      // Aqui você enviaria o código digitado para o LeitorBarcode,
      // mas como ele é o emissor, vamos refatorar a busca para um serviço ou injetar
      // o WebSocketService diretamente aqui ou no LeitorBarcode e emitir um evento.
      // Por simplicidade e seguindo o seu design, o LeitorBarcode cuidará da emissão.
      
      // Para o fluxo de digitação, vamos assumir que o LeitorBarcode terá um método público
      // ou que você irá buscar o produto diretamente aqui usando o wsService.
      // Vou buscar diretamente aqui para desacoplar a lógica de digitação do LeitorBarcode.
      
      // >>> NECESSÁRIO INJETAR WebSocketService SE USAR ESTE TRECHO <<<
      // Exemplo de como você faria aqui:
      /*
      const codews = { codigo: this.codigoManual.trim() };
      this.wsService.send({
        action: 'get_produto_cod',
        data: codews
      });
      this.codigoManual = ''; // Limpa o campo após o envio
      */
      
      // Por enquanto, vamos focar na integração via output
    }
  }

  // Você pode adicionar mais métodos aqui, como finalizarEntrada(), removerItem(), etc.
}