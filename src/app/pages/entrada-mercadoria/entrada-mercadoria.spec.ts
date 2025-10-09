import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaMercadoria } from './entrada-mercadoria';

describe('EntradaMercadoria', () => {
  let component: EntradaMercadoria;
  let fixture: ComponentFixture<EntradaMercadoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaMercadoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaMercadoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
