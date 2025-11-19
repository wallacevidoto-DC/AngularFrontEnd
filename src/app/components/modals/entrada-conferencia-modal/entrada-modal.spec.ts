import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaModal } from './entrada-modal';

describe('EntradaModal', () => {
  let component: EntradaModal;
  let fixture: ComponentFixture<EntradaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
