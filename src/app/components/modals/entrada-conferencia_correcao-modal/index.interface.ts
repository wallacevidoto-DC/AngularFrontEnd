import { ProdutoSpDto } from "../entrada-modal/index.interface";

export interface CorrecaoEntrada {
  tipo: "CR. CONFERÊNCIA";
  conferenciaId:number;
  qtd_conferida: number;
  userId: number;
  dataf: string;
  semf: number;
  lote: string;
  cifName?: string;
}