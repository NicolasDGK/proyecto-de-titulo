import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

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
  
  GetSupermarkets():Observable<any> {
    return this.http.get(`${environment.hostname}/Supermarkets`);
  }
  
  GetProductsCart(list_id:string):Observable<any> {
    return this.http.get(`${environment.hostname}/ProductsCart/${list_id}`);
  }
  
  PostCotizacion(id_usuario:number, monto_total:number, fecha:string):Observable<any> {
    return this.http.post(`${environment.hostname}/InsertarCotizacion`, JSON.stringify({"id_usuario": id_usuario, "monto_total": monto_total, "fecha": fecha}), this.HttpUploadOptions);
  }
  
  PostCotizacionProductos(values: string): Observable<any> {
    const body = { values: values }; // Wrap the values in an object

    return this.http.post(`${environment.hostname}/InsertarCotizacionProductos`, body, this.HttpUploadOptions);
  }
}
