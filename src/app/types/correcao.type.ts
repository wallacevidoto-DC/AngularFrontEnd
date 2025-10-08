import { SaidaFormDataOut } from "../components/modals/saida-modal/saida-modal"

export type CorrecaoType = {
    action: 'correcao',
    user: number,
    observacao:string
    product: SaidaFormDataOut
}