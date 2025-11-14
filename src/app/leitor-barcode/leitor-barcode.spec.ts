import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeitorBarcode } from './leitor-barcode';

describe('LeitorBarcode', () => {
  let component: LeitorBarcode;
  let fixture: ComponentFixture<LeitorBarcode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeitorBarcode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeitorBarcode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
