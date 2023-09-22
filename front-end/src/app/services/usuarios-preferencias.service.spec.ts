import { TestBed } from '@angular/core/testing';

import { UsuariosPreferenciasService } from './usuarios-preferencias.service';

describe('UsuariosPreferenciasService', () => {
  let service: UsuariosPreferenciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosPreferenciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
