import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrecaoModal } from './correcao-modal';

describe('CorrecaoModal', () => {
  let component: CorrecaoModal;
  let fixture: ComponentFixture<CorrecaoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrecaoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrecaoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
