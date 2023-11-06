import { Component, OnInit } from '@angular/core';
import { Cotizacion } from 'src/app/interfaces/cotizacion';
import { HistoryService } from 'src/app/services/history.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CotizacionesProductos } from 'src/app/interfaces/cotizaciones-productos';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  offset:number = 0;
  flag_pagination:boolean = false;
  flag_previous:boolean = false;
  flag_next:boolean = true;
  total_cotizaciones:number = 0;
  

  ListaCotizaciones = new Array<Cotizacion>();
  ListaProductos = new Array<CotizacionesProductos>();
  
  helper = new JwtHelperService();
  
  panelOpenState = false;

  constructor(private http:HistoryService, private router: Router) { }

  ngOnInit(): void {
    var id_usuario:number = this.get_id_usuario();
  
    this.http.GetTotalCotizacionesUser(id_usuario).subscribe(datos => {
      this.total_cotizaciones = datos.items;
      
      if (this.total_cotizaciones > 10) {
        this.flag_pagination = true;
      }
    })
  
    this.http.GetCotizacionesUsuario(id_usuario, this.offset).subscribe(datos => {
      for(let i=0; i<datos.length; i++) {
        this.ListaCotizaciones.push(datos[i]);
        this.ListaCotizaciones[i].fecha = this.convert_date(datos[i].fecha);
      }
      console.log('Cotizaciones Loaded:', this.ListaCotizaciones);
    })
  }
  
  insertCotizacionesProductos(idCotizacion: number, idProducto: number, cantidad: number): void {
    const data = {
      id_cotizacion: idCotizacion,
      id_producto: idProducto,
      cantidad: cantidad
    };


  }

  get_id_usuario():number {
    var token = localStorage.getItem('token') ?? '';
    var decodetoken = this.helper.decodeToken(token);
    var id_usuario:number = decodetoken['data']['id_usuario'];
    return id_usuario;
  }

  convert_date(fecha:Date) {
    var new_fecha = new Date(fecha);
    var dd = String(new_fecha.getDate()).padStart(2, '0');
    var mm = String(new_fecha.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = String(new_fecha.getFullYear());
    return dd + '/' + mm + '/' + yyyy;
  }
  
  get_products(id_cotizacion:number) {
    this.ListaProductos = [];
    this.http.GetCotizacionesProductos(id_cotizacion).subscribe(datos => {
      for(let i=0; i<datos.length; i++) {
        this.ListaProductos.push(datos[i]);
      }
      console.log('CotizacionesProductos Loaded:', this.ListaProductos);
    })
  }
  
  numberWithPoints(precio:any) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  refresh_cotizaciones() {
    this.ListaCotizaciones = [];
    this.ListaProductos = [];
    var id_usuario = this.get_id_usuario();
    this.http.GetCotizacionesUsuario(id_usuario, this.offset).subscribe(datos => {
      for(let i=0; i<datos.length; i++) {
        this.ListaCotizaciones.push(datos[i]);
        this.ListaCotizaciones[i].fecha = this.convert_date(datos[i].fecha);
      }
    })
  }
  
  previous_page() {
    this.offset = this.offset - 10;
    if (this.offset < 0) {
      this.offset = 0;
    }
    
    this.refresh_cotizaciones();
    
    if (this.offset <= 10) {
      this.flag_previous = false;
    } else {
      this.flag_previous = true;
    }
    
    if (this.offset >= this.total_cotizaciones) {
      this.flag_next = false;
    } else {
      this.flag_next = true;
    }
  }
  
  next_page() {
    this.offset = this.offset + 10;
    
    this.refresh_cotizaciones();
    
    if (this.offset < 10) {
      this.flag_previous = false;
    } else {
      this.flag_previous = true;
    }
    
    if (this.offset + 10 >= this.total_cotizaciones) {
      this.flag_next = false;
    } else {
      this.flag_next = true;
    }
  }
  
  add_products_localstorage(id_cotizacion:number) {
    var ListaProductosCart:any[] = [];
    this.http.GetCotizacionesProductos(id_cotizacion).subscribe(datos => {
      for(let i=0; i<datos.length; i++) {
        ListaProductosCart.push({id_producto: datos[i].id_producto,
                                 imagen: datos[i].imagen_producto,
                                 marca: datos[i].marca_producto,
                                 multiplicador: datos[i].multiplicador,
                                 nombre: datos[i].nombre_producto});
      }
      localStorage.setItem('cart', JSON.stringify(ListaProductosCart));
    })
  }
  
  add_cotizacion_cart(id_cotizacion:number) {
    if (localStorage.getItem("cart") != null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Cuidado!',
        text: 'Si aceptas perderás tu cotización actual.',
        showCancelButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#FF6F1E'
      }).then((result) => {
        if (result.isConfirmed) {
          this.add_products_localstorage(id_cotizacion);
          Swal.fire({
            icon: 'success',
            title: '¡Cotización cargada con éxito!',
            text: 'La cotización se cargó exitosamente.',
            confirmButtonColor: '#FF6F1E'
          }).then(a => {
            this.router.navigate(['cart']);
          })
        }
      })
    } else {
      localStorage.removeItem('cart');
      this.add_products_localstorage(id_cotizacion);
      
      Swal.fire({
        icon: 'success',
        title: '¡Cotización cargada con éxito!',
        text: 'La cotización se cargó exitosamente.',
        confirmButtonColor: '#FF6F1E'
      }).then(a => {
        this.router.navigate(['cart']);
      })
    }
  }
}
