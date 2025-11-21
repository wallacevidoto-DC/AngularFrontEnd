import { ProdutoSpDto } from "../entrada-modal/index.interface";

export interface SaidaDto {
    tipo?: "SAIDA";
    observacao?: string;
    userId?: number;
    estoqueId:number
    qtdRetirada?:Number
}