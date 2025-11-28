import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOperation } from './select-operation';

describe('SelectOperation', () => {
  let component: SelectOperation;
  let fixture: ComponentFixture<SelectOperation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOperation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOperation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
