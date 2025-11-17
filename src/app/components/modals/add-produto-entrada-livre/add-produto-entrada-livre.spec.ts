import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProdutoEntradaLivre } from './add-produto-entrada-livre';

describe('AddProdutoEntradaLivre', () => {
  let component: AddProdutoEntradaLivre;
  let fixture: ComponentFixture<AddProdutoEntradaLivre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProdutoEntradaLivre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProdutoEntradaLivre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
