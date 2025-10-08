import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidaModal } from './saida-modal';

describe('SaidaModal', () => {
  let component: SaidaModal;
  let fixture: ComponentFixture<SaidaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaidaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaidaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
