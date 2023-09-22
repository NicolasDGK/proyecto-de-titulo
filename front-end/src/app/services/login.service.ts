import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUser:Usuario = {
    id_usuario: -1,
    nombre: '',
    email: '',
  };
  
  isLoggedIn:boolean = false;

  helper = new JwtHelperService();

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
  
  GetUsuario(email:string):Observable<any> {
    return this.http.get(`${environment.hostname}/Usuario/${email}`);
  }
  
  PostUsuario(nombre:string, password:string, email:string):Observable<any> {
    return this.http.post(`${environment.hostname}/InsertarUsuario`, JSON.stringify({"nombre": nombre, "password": password, "email": email}), this.HttpUploadOptions);
  }
  
  async PostLogin(email:string, password:string){
    const url = `${environment.hostname}/Login`
      try{
        var request = await fetch(url, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify({"email": email, "password": password})
        });    
        
        let body = await request.json()
        
        if (request.status == 400) {
          console.log(body.mensaje)
          return 
        }
        
        const decodedToken = this.helper.decodeToken(body.token);

        this.currentUser.nombre = decodedToken.data.nombre;
        this.currentUser.email = decodedToken.data.email;
        this.currentUser.id_usuario = decodedToken.data.id_usuario;
        this.isLoggedIn = true;
        localStorage.setItem('token', body.token);
        
        return this.currentUser
      } catch(error) {
        console.log('error fetch', error)
        return
      }  
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }
  
  loggedIn():any {
    const token =  localStorage.getItem('token') ?? '';
    if (this.helper.isTokenExpired(token) == true) {
      this.logout();
      return false
    }
    return true;
  }
}
