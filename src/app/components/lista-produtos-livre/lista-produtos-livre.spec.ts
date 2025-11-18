import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProdutosLivre } from './lista-produtos-livre';

describe('ListaProdutosLivre', () => {
  let component: ListaProdutosLivre;
  let fixture: ComponentFixture<ListaProdutosLivre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProdutosLivre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProdutosLivre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
