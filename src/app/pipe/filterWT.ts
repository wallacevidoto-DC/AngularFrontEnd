import { Pipe, PipeTransform } from '@angular/core';
import { ProdutoIO, WT } from '../components/modals/entrada-modal/entrada-modal';

@Pipe({
  name: 'filterWT',
  standalone: true
})
export class FilterWT implements PipeTransform {
  transform(produtos: ProdutoIO[], wtToExclude?: WT): ProdutoIO[] {
    if (!produtos) return [];
    if (!wtToExclude) return produtos;
    // Retorna todos produtos que NÃO têm o WT especificado
    return produtos.filter(p => p.wt !== wtToExclude);
  }
}
