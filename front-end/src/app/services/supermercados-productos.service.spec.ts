import { TestBed } from '@angular/core/testing';

import { SupermercadosProductosService } from './supermercados-productos.service';

describe('SupermercadosProductosService', () => {
  let service: SupermercadosProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupermercadosProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
