import { Pipe, PipeTransform } from '@angular/core';
import { ProdutoSpDto,Origem } from '../components/modals/entrada-modal/index.interface';

@Pipe({
  name: 'filterWT',
  standalone: true
})
export class FilterWT implements PipeTransform {
  transform(produtos: ProdutoSpDto[], wtToExclude?: Origem): ProdutoSpDto[] {
    if (!produtos) return [];
    if (!wtToExclude) return produtos;
    // Retorna todos produtos que NÃO têm o WT especificado
    return produtos.filter(p => p.propsPST.origem !== wtToExclude);
  }
}
