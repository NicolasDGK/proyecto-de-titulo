import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http:HttpClient) { }
  
  HttpUploadOptions = {
    headers: new HttpHeaders (
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
        'Content-Type': 'application/json',
      }
    ),
  };
  
  GetCotizacionesUsuario(id_usuario:number, offset:number):Observable<any> {
    return this.http.get(`${environment.hostname}/CotizacionesUsuario/${id_usuario}/${offset}`);
  }
  
  GetCotizacionesProductos(id_cotizacion:number):Observable<any> {
    return this.http.get(`${environment.hostname}/CotizacionesProductos/${id_cotizacion}`);
  }
  
  GetTotalCotizacionesUser(id_usuario:number):Observable<any> {
    return this.http.get(`${environment.hostname}/TotalCotizacionesUser/${id_usuario}`);
  }


}
