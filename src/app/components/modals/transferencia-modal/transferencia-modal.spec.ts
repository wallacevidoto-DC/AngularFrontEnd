import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaModal } from './transferencia-modal';

describe('TransferenciaModal', () => {
  let component: TransferenciaModal;
  let fixture: ComponentFixture<TransferenciaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferenciaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferenciaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
