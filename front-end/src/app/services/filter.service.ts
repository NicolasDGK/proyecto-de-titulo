import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

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
  
  GetCategories():Observable<any> {
    return this.http.get(`${environment.hostname}/ListCategorias`);
  }
  
  PostFilterBrand(categoria:any, tipo:any):Observable<any> {
    return this.http.post(`${environment.hostname}/FilterBrand`, JSON.stringify({"categoria": categoria, "tipo": tipo}), this.HttpUploadOptions)
  }
  
  PostFilterType(marca:any, categoria:any):Observable<any> {
    return this.http.post(`${environment.hostname}/FilterType`, JSON.stringify({"marca": marca, "categoria": categoria}), this.HttpUploadOptions)
  }
  
  PostFilterCategory(marca:any, tipo:any):Observable<any> {
    return this.http.post(`${environment.hostname}/FilterCategory`, JSON.stringify({"marca": marca, "tipo": tipo}), this.HttpUploadOptions)
  }
  
  GetProductsFilter(categoria:any, marca:any, tipo:any, precio_inicial:any, precio_final:any, offset:any):Observable<any> {
    return this.http.get(`${environment.hostname}/FilterProducts/${categoria}/${marca}/${tipo}/${precio_inicial}/${precio_final}/${offset}`);
  }
  
  GetTotalFilter(categoria:any, marca:any, tipo:any, precio_inicial:any, precio_final:any):Observable<any> {
    return this.http.get(`${environment.hostname}/TotalFilter/${categoria}/${marca}/${tipo}/${precio_inicial}/${precio_final}`);
  }

  getSupermarketsForProduct(id: number): Observable<any> {
    return this.http.get(`${environment.hostname}/SuperForProduct/${id}`);
  }

}
