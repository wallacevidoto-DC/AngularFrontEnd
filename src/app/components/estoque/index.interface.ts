export interface Produto {
  codigo: string;
  descricao: string;
}

export interface EstoqueItem {
  estoqueId: number;
  enderecoId?: string | null;
  produtoId: number;
  semF: number;
  quantidade: number;
  dataF: string;
  dataL: string;
  lote?: string | null;
  obs?: string | null;
  createAt: string;
  updateAt: string;
  produto?: Produto | null;
}

