export interface EntradaDto {
    tipo?: "ENTRADA";
    rua: string;
    bloco: string;
    apt: string;
    dataEntrada: Date;
    observacao: string;
    userId: number;
    produtos: ProdutoSpDto[];
}

export interface ProdutoSpDto {
    produtoId: number;
    codigo: string;
    descricao: string;
    quantidade: number;
    dataf: string;
    semf: number;
    lote: string;
    propsPST: PropsPST;
}

export interface PropsPST {
    origem: Origem;
    isModified: boolean;
}

export enum Origem {
    IN = "IN",
    OUT = "OUT"
}
export interface ResponseGetAddress {
  ProdutoId: number
  Codigo: string
  Descricao: string
  Produto: any
  DataL: string
  DataF: string
  SemF: number
  Lote: string
  Quantidade: number
  EstoqueId:number
}