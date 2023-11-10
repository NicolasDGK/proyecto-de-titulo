import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Usuario } from 'src/app/interfaces/usuario';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form_register:FormGroup;
  form_login:FormGroup;
  Usuario:Usuario;

  constructor(public fb_register:FormBuilder, public fb_login:FormBuilder, private http:LoginService, private router: Router, private productService: ProductosService) {
    this.form_register = this.fb_register.group({
      email_r: ["", [Validators.required, Validators.email]],
      nombre: ["", [Validators.required]],
      password_r: ["", [Validators.required, Validators.minLength(8)]]
    });
    
    this.form_login = this.fb_login.group({
      email_l: ["", [Validators.required, Validators.email]],
      password_l: ["", [Validators.required]]
    });
    
    this.Usuario = {
      id_usuario: 0,
      nombre: '',
      email: ''
    }
  }

  
  ngOnInit(): void {

    this.fetchSubscribedProducts(); // Add this line
  }
  
  getUser(email:string):any {
    this.http.GetUsuario(email).subscribe(datos => {
      return datos[0];
    })
  }
  
  async onSubmitRegister() {
    if (this.form_register.valid && this.form_register.get('email_r')?.valid) {
      const nombre = this.form_register.get('nombre')?.value;
      const password = this.form_register.get('password_r')?.value;
      const email = this.form_register.get('email_r')?.value;
      
      await this.http.GetUsuario(email).subscribe(datos => {
        if(typeof(datos[0]) === 'undefined') {
          this.http.PostUsuario(nombre, password, email).subscribe();
          this.http.PostLogin(email, password);
          
          Swal.fire({
            icon: 'success',
            title: 'Registro con éxito',
            text: '¡Bienvenido ' + nombre + '!',
            confirmButtonColor: '#FF6F1E'
          }).then(a => {
            this.router.navigate(['']);
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: '¡Email ya se encuentra registrado!',
            confirmButtonColor: '#FF6F1E'
          }).then(a => {
            this.router.navigate(['login']);
          })
        }
      })
    }
  }
 
  async onSubmitLogin() {
    if (this.form_login.valid && this.form_login.get('email_l')?.valid) {
      const email = this.form_login.get('email_l')?.value;
      const password = this.form_login.get('password_l')?.value;
        
      await this.http.PostLogin(email, password);
        
      if (this.http.isLoggedIn) {
        Swal.fire({
          icon: 'success',
          title: 'Ingreso con éxito',
          text: '¡Bienvenido ' + this.http.currentUser.nombre + '!',
          confirmButtonColor: '#FF6F1E'
        }).then(a => {
          this.router.navigate(['']);
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Email o contraseña incorrecta!',
          confirmButtonColor: '#FF6F1E'
        }).then(a => {
          this.router.navigate(['login']);
        })
      }
    }
  }

  isLoggedIn():boolean {
    return this.http.isLoggedIn;
  }
  
  async fetchSubscribedProducts() {
    try {
      const userId = this.Usuario.id_usuario; 
  
      const subscribedProductIds = await this.productService.fetchSubscribedProducts(userId).toPromise();
  
      console.log('Subscribed Product IDs:', subscribedProductIds);
    } catch (error) {
      console.error('Error fetching subscribed products:', error);
    }
  }

}
