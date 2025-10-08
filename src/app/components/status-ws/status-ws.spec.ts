import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusWs } from './status-ws';

describe('StatusWs', () => {
  let component: StatusWs;
  let fixture: ComponentFixture<StatusWs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusWs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusWs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
