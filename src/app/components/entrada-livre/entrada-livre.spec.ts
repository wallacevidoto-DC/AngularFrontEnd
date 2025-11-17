import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaLivre } from './entrada-livre';

describe('EntradaLivre', () => {
  let component: EntradaLivre;
  let fixture: ComponentFixture<EntradaLivre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaLivre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaLivre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
