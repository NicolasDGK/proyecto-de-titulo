import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private previousPrices: { [productId: number]: number } = {};

  constructor(private notificationService: NotificationService, private http:HttpClient) { }
  
  /*checkForPriceDecrease(productId: number, currentPrice: number) {
    // Check if there is a previous price for this product
    if (this.previousPrices.hasOwnProperty(productId)) {
      const previousPrice = this.previousPrices[productId];

      // Compare the current price with the previous price
      if (currentPrice < previousPrice) {
        // Trigger a notification
        this.notificationService.addNotification(`Un producto al que te has suscrito ha bajado de precio. ID: ${productId}.`);
      }
    }

    // Update the previous price with the current price
    this.previousPrices[productId] = currentPrice;
  }*/

  
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
  
  GetListProductos():Observable<any> {
    return this.http.get(`${environment.hostname}/ListProductos`);
  }
  
  GetProducto(id:number):Observable<any> {
    return this.http.get(`${environment.hostname}/Producto/${id}`);
  }
  
  GetListProductsCategory(id:number):Observable<any> {
    return this.http.get(`${environment.hostname}/ProductosCategoria/${id}`);
  }
  
  GetListProductsBestPrice():Observable<any> {
    return this.http.get(`${environment.hostname}/ListProductsBestPrice`);
  }
  
  GetAllProductsName(search:any):Observable<any> {
    return this.http.get(`${environment.hostname}/AllProductsName/${search}`);
  }

  GetMostViewProductsDay():Observable<any> {
    return this.http.get(`${environment.hostname}/MostViewProductos`);
  }

  GetUserPreference(userId: number, productId: number): Observable<any> {
    return this.http.get(`${environment.hostname}/GetUserPreference/${userId}/${productId}`);
  }

  GetLowestPriceProducto(productId: number): Observable<any> {
    return this.http.get(`${environment.hostname}/Productos/${productId}/GetLowestPriceForProduct`);
  }

  UpdateLowestPriceForProduct(productId: number, newLowestPrice: number): Observable<any> {
    const requestBody = { newLowestPrice };
    return this.http.put<any>(`${environment.hostname}/usuarios-preferencias/${productId}/UpdateLowestPrice`, requestBody);
  }

  GetSavedLowestPrice(productId: number, userId: number): Observable<number> {
    return this.http.get<any>(`${environment.hostname}/usuarios-preferencias/${userId}/${productId}`)
      .pipe(
        tap((response: any) => console.log('API Response for GetSavedLowestPrice:', response)), // Log the response
        map((response: any) => response.data.lowest_price as number) // Extract 'lowest_price' property from 'data' as a number
      );
  }

  GetProductoName(productId: number): Observable<string> {
    // Make an HTTP request to fetch the product name
    return this.http.get<string>(`${environment.hostname}/Productos/${productId}/get-product-name`);
  }

  fetchSubscribedProducts(userId: number): Observable<number[]> {
    // Make an HTTP GET request to the backend to retrieve the list of subscribed products
    return this.http.get<number[]>(`/usuarios-preferencias/${userId}/subscribed-products`);
  }

  getTemplateById(templateId: number): Observable<any> {
    const apiUrl = `${environment.hostname}/Cotizaciones/get_template_by_id/${templateId}`;
    return this.http.get(apiUrl);
  }

  GetCotizacionesProductos(id_cotizacion:number):Observable<any> {
    return this.http.get(`${environment.hostname}/CotizacionesProductos/${id_cotizacion}`);
  }

  getSupermarketsForProduct(id:number):Observable<any> {
    return this.http.get(`${environment.hostname}/SuperForProduct/${id}`);
  }
  

}
