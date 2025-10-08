import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDescricao } from './dialog-descricao';

describe('DialogDescricao', () => {
  let component: DialogDescricao;
  let fixture: ComponentFixture<DialogDescricao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDescricao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDescricao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
