import { ProdutoSpDto } from "../entrada-modal/index.interface";

export interface TransferenciaDto {
    tipo?: "TRANSFERENCIA";
    rua: string;
    bloco: string;
    apt: string;
    endOld:string;
    estoqueID:number;
    observacao: string;
    dataEntrada: string;
    userId: number;
    produto: ProdutoSpDto;
}