export interface CifsDto {
    cifId?: number;
    date?: string; // ISO string
    cirt?: string;
    produtoId?: number | null;
    qtd?: number | null;
    create_at?: string | null;
    update_at?: string | null;
}

export interface EntradasDto {
    entradaId?: number;
    tipo?: string;
    produtoId?: number | null;
    qtd_conferida?: number | null;
    qtd_entrada?: number | null;
    cifsId?: number | null;
    create_at?: string | null;
    update_at?: string | null;
}