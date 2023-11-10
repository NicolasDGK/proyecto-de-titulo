import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuariosPreferenciasService {

  constructor(private http: HttpClient) {}

  helper = new JwtHelperService();


  get_id_usuario():number {
    const token = localStorage.getItem('token') || '';
    const decodetoken = this.helper.decodeToken(token);
    console.log('Decoded Token:', decodetoken);
    const id_usuario: number = decodetoken['data']['id_usuario'];
    console.log('User ID (before request):', id_usuario);
    return id_usuario;
  }

  getUserPreferences(userId: number, productId: number): Observable<any> {
    // Send an HTTP GET request to retrieve user preferences
    return this.http.get(`${environment.hostname}/usuarios-preferencias/get/${userId}/${productId}`);
  }

  saveUserPreference(productId: number, userId: number): Observable<any> {
    console.log('Before making the HTTP request'); 
    console.log('User ID (before request):', userId); 
    console.log('Product ID (before request):', productId); 
    // Create a user preference object
    const userPreference = { user_id_usuario: userId, product_id: productId };
    console.log('User Preference:', userPreference);
    // Send an HTTP POST request to save the user preference
    return this.http.post(`${environment.hostname}/usuarios-preferencias/save`, userPreference)
      .pipe(
        catchError(error =>{
          console.error('HTTP request error:',error);
          return throwError(error);
        })
      )
  }
  

  // Method to delete a user preference
  deleteUserPreference(productId: number, userId: number): Observable<any> {
    // Send an HTTP DELETE request to delete the user preference
    return this.http.delete(`${environment.hostname}/usuarios-preferencias/delete`, {
      params: { userId: userId.toString(), productId: productId.toString() }
    });
  }

  isUserSubscribed(userId: number, productId: number): Observable<any> {
    // Send an HTTP GET request to check if the user is subscribed to the product
    return this.http.get(`${environment.hostname}/usuarios-preferencias/is-subscribed/${userId}/${productId}`);
  }

  getAllSubscribedProducts(): Observable<any> {
    // Fetch all subscribed products
    return this.http.get(`${environment.hostname}/usuarios-preferencias/all-subscribed-products`);
  }

}