import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaEstoque } from './mapa-estoque';

describe('MapaEstoque', () => {
  let component: MapaEstoque;
  let fixture: ComponentFixture<MapaEstoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaEstoque]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaEstoque);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
