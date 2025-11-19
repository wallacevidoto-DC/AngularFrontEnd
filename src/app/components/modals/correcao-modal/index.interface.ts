import { ProdutoSpDto } from "../entrada-modal/index.interface";

export interface CorrecaoDto {
  tipo: "CORRECAO";
  estoqueId: number;
  userId: number;
  observacao?: string;
  produto: ProdutoSpDto;
}