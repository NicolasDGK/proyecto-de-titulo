import { Component, OnInit } from '@angular/core';
import { Supermarket } from 'src/app/interfaces/supermarket';
import { ProductCart } from 'src/app/interfaces/product-cart';
import { CartService } from 'src/app/services/cart.service';
import { LoginService } from 'src/app/services/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  ListaSupermercados = new Array<Supermarket>();
  ListaSanta = new Array<ProductCart>();
  ListaJumbo = new Array<ProductCart>();
  ListaUnimarc = new Array<ProductCart>()
  ListProducts = new Array <ProductCart>();
  ListRow:any[] = [];
  ProductsInCart:any[] = [];
  total_santa:number = 0;
  total_jumbo:number = 0;
  total_unimarc:number = 0;
  
  helper = new JwtHelperService();

  constructor(private http:CartService, private login:LoginService, private router: Router) { }

  
  ngOnInit(): void {
    this.load_supermarkets();
    
    this.ProductsInCart = JSON.parse(localStorage.getItem('cart')!) || [];
    
    let list_id:string = '';
    if (this.ProductsInCart.length > 0) {
      list_id = this.get_products_supermarkets();
    }
    
    this.refresh_rows(list_id);
  }
  
  onImgError(event:any) { 
    event.target.src = '../../../assets/icon-alert.png';
  }

  numberWithPoints(precio:any) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  calculate_total() {
    this.total_santa = 0;
    this.total_jumbo = 0;
    this.total_unimarc = 0;
    for(let i=0; i<this.ListRow.length; i++) {
      if(this.ListRow[i]['value_santa'] != 'no-stock' && this.ListRow[i]['value_santa'] != 'no-distribuye') {
        this.total_santa = this.total_santa + parseInt(this.ListRow[i]['value_santa']);
      }
      
      if(this.ListRow[i]['value_jumbo'] != 'no-stock' && this.ListRow[i]['value_jumbo'] != 'no-distribuye') {
        this.total_jumbo = this.total_jumbo + parseInt(this.ListRow[i]['value_jumbo']);
      }

      if(this.ListRow[i]['value_unimarc'] != 'no-stock' && this.ListRow[i]['value_unimarc'] != 'no-distribuye') {
        this.total_unimarc = this.total_unimarc + parseInt(this.ListRow[i]['value_unimarc']);
      }
    }
  }
  
  best_price(total:number) {
    if (total <= this.total_jumbo && total <= this.total_santa) {
      return true;
    }
    return false;
  }
  
  load_supermarkets() {
    this.http.GetSupermarkets().subscribe(datos => {
      for(let i=0; i<datos.items.length; i++) {
        this.ListaSupermercados.push(datos.items[i]);
      }
    })
  }
  
  get_products_supermarkets():string {
    let list_id:string = '';
    for(let i=0; i<this.ProductsInCart.length; i++) {
      if (i == 0) {
        list_id = this.ProductsInCart[i]['id_producto'];
      } else {
        list_id = list_id + ',' + this.ProductsInCart[i]['id_producto']
      }
    }
    return list_id;
  }

  exists_product_row(id_producto:number):boolean {
    for(let i=0; i<this.ListRow.length; i++) {
      if(this.ListRow[i]['id_producto'] == id_producto) {
        return true;
      }
    }
    return false;
  }
  
  refresh_rows(list_id:string) {
    if (list_id != '') {
      this.ListRow = [];
      this.ListProducts = [];
      this.http.GetProductsCart(list_id).subscribe(datos => {
        for(let i=0; i<datos.items.length; i++) {
          this.ListProducts.push(datos.items[i]);
        }
        
        for(let i=0; i<this.ProductsInCart.length; i++) {
          let flag_santa:boolean = false;
          let flag_jumbo:boolean = false;
          let flag_unimarc:boolean = false;
          
          let initial_value_santa:string = '';
          let value_santa:string = '';
          let status_santa:string = '';
          
          let initial_value_jumbo:string = '';
          let value_jumbo:string = '';
          let status_jumbo:string = '';

          let initial_value_unimarc:string = '';
          let value_unimarc:string = '';
          let status_unimarc:string = '';
          
          let multiplicador:number = this.ProductsInCart[i]['multiplicador'];
          
          if (this.exists_product_row(this.ProductsInCart[i]['id_producto']) == false) {
            for(let j=0; j<this.ListProducts.length; j++) {           
              if (this.ListProducts[j].supermercado == 'Santa Isabel' && this.ListProducts[j].id_producto == this.ProductsInCart[i]['id_producto']) {
                if (this.ListProducts[j].disponibilidad == 'No') {
                  status_santa = 'no-stock';
                  value_santa = 'no-stock';
                } else {
                  if (this.ListProducts[j].precio_oferta != '-') {
                    initial_value_santa = this.ListProducts[j].precio_oferta;
                    value_santa = String(parseInt(this.ListProducts[j].precio_oferta) * multiplicador);
                    status_santa = 'oferta';
                  } else {
                    initial_value_santa = this.ListProducts[j].precio_normal;
                    value_santa = String(parseInt(this.ListProducts[j].precio_normal) * multiplicador);
                    status_santa = 'normal';
                  }
                }
                flag_santa = true;
              }
              
              if (this.ListProducts[j].supermercado == 'Jumbo' && this.ListProducts[j].id_producto == this.ProductsInCart[i]['id_producto']) {
                if (this.ListProducts[j].disponibilidad == 'No') {
                  value_jumbo = 'no-stock';
                  status_jumbo = 'no-stock';
                } else {
                  if (this.ListProducts[j].precio_oferta != '-') {
                    initial_value_jumbo = this.ListProducts[j].precio_oferta;
                    value_jumbo = String(parseInt(this.ListProducts[j].precio_oferta) * multiplicador);
                    status_jumbo = 'oferta';
                  } else {
                    initial_value_jumbo = this.ListProducts[j].precio_normal;
                    value_jumbo = String(parseInt(this.ListProducts[j].precio_normal) * multiplicador);
                    status_jumbo= 'normal';
                  }
                }
                flag_jumbo = true;
              }

              if (this.ListProducts[j].supermercado == 'Unimarc' && this.ListProducts[j].id_producto == this.ProductsInCart[i]['id_producto']) {
                if (this.ListProducts[j].disponibilidad == 'No') {
                  value_unimarc = 'no-stock';
                  status_unimarc = 'no-stock';
                } else {
                  if (this.ListProducts[j].precio_oferta != '-') {
                    initial_value_jumbo = this.ListProducts[j].precio_oferta;
                    value_unimarc = String(parseInt(this.ListProducts[j].precio_oferta) * multiplicador);
                    status_unimarc = 'oferta';
                  } else {
                    initial_value_unimarc = this.ListProducts[j].precio_normal;
                    value_unimarc = String(parseInt(this.ListProducts[j].precio_normal) * multiplicador);
                    status_unimarc= 'normal';
                  }
                }
                flag_unimarc = true;
              }
              
              if (flag_santa == false) {
                value_santa = 'no-distribuye';
                status_santa = 'no-distribuye';
              }
              
              if (flag_jumbo == false) {
                value_jumbo = 'no-distribuye';
                status_jumbo = 'no-distribuye';
              }

              if (flag_unimarc == false) {
                value_unimarc = 'no-distribuye';
                status_unimarc = 'no-distribuye';
              }
            }
            
            this.ListRow.push({id_producto: this.ProductsInCart[i]['id_producto'], 
                               nombre: this.ProductsInCart[i]['nombre'], 
                               marca: this.ProductsInCart[i]['marca'],
                               imagen: this.ProductsInCart[i]['imagen'],
                               value_santa: value_santa, 
                               status_santa: status_santa, 
                               value_jumbo: value_jumbo, 
                               status_jumbo: status_jumbo,
                               value_unimarc: value_unimarc,
                               status_unimarc: status_unimarc,
                               multiplicador: multiplicador,
                               initial_value_jumbo: initial_value_jumbo,
                               initial_value_santa: initial_value_santa,
                               initial_value_unimarc: initial_value_unimarc})
          }
        }
        this.calculate_total(); 
      })
    }
  }
  
  delete_row(id_producto:number) {
    for(let i=0; i<this.ProductsInCart.length; i++) {
      if (this.ProductsInCart[i]['id_producto'] == id_producto) {
        this.ProductsInCart.splice(i, 1);
        localStorage.setItem('cart', JSON.stringify(this.ProductsInCart));
        
        let list_id:string = '';
        if (this.ProductsInCart.length > 0) {
          list_id = this.get_products_supermarkets();
        } else {
          
        }
        
        this.refresh_rows(list_id);
      }
    }
    console.log(this.ProductsInCart.length)
  }
  
  subtract_multiplier(id_producto:number) {
    for(let i=0; i<this.ListRow.length; i++) {
      if (this.ListRow[i]['id_producto'] == id_producto) {
        this.ListRow[i]['multiplicador'] = this.ListRow[i]['multiplicador'] - 1;
        this.replace_multiplicador(id_producto, this.ListRow[i]['multiplicador']);
        if (this.ListRow[i]['value_santa'] != 'no-stock' && this.ListRow[i]['value_santa'] != 'no-distribuye') {
          this.ListRow[i]['value_santa'] = String(parseInt(this.ListRow[i]['initial_value_santa']) * this.ListRow[i]['multiplicador'])
        }
        
        if (this.ListRow[i]['value_jumbo'] != 'no-stock' && this.ListRow[i]['value_jumbo'] != 'no-distribuye') {
          this.ListRow[i]['value_jumbo'] = String(parseInt(this.ListRow[i]['initial_value_jumbo']) * this.ListRow[i]['multiplicador'])
        }

        if (this.ListRow[i]['value_unimarc'] != 'no-stock' && this.ListRow[i]['value_unimarc'] != 'no-distribuye') {
          this.ListRow[i]['value_unimarc'] = String(parseInt(this.ListRow[i]['initial_value_unimarc']) * this.ListRow[i]['multiplicador'])
        }
      }
    }
    this.calculate_total(); 
  }
  
  replace_multiplicador(id_producto:number, multiplicador:number) {
    for(let i=0; i<this.ProductsInCart.length; i++) {
      if(this.ProductsInCart[i]['id_producto'] == id_producto) {
        this.ProductsInCart[i]['multiplicador'] = multiplicador;
        localStorage.setItem('cart', JSON.stringify(this.ProductsInCart));
        return
      }
    }
  }
  
  add_multiplier(id_producto:number) {
    for(let i=0; i<this.ListRow.length; i++) {
      if (this.ListRow[i]['id_producto'] == id_producto) {
        this.ListRow[i]['multiplicador'] = this.ListRow[i]['multiplicador'] + 1;
        this.replace_multiplicador(id_producto, this.ListRow[i]['multiplicador']);
        if (this.ListRow[i]['value_santa'] != 'no-stock' && this.ListRow[i]['value_santa'] != 'no-distribuye') {
          this.ListRow[i]['value_santa'] = String(parseInt(this.ListRow[i]['initial_value_santa']) * this.ListRow[i]['multiplicador'])
        }
        
        if (this.ListRow[i]['value_jumbo'] != 'no-stock' && this.ListRow[i]['value_jumbo'] != 'no-distribuye') {
          this.ListRow[i]['value_jumbo'] = String(parseInt(this.ListRow[i]['initial_value_jumbo']) * this.ListRow[i]['multiplicador'])
        }

        if (this.ListRow[i]['value_unimarc'] != 'no-stock' && this.ListRow[i]['value_unimarc'] != 'no-distribuye') {
          this.ListRow[i]['value_unimarc'] = String(parseInt(this.ListRow[i]['initial_value_unimarc']) * this.ListRow[i]['multiplicador'])
        }
      }
    }
    this.calculate_total(); 
  }
  
  remove_localstorage() {
    this.ListRow = [];
    this.ProductsInCart = [];
    localStorage.removeItem('cart');
  }
  
  clear_cart() {
    Swal.fire({
      icon: 'warning',
      title: '¡Cuidado!',
      text: 'Si aceptas se borrará todos los productos de tu carrito.',
      confirmButtonColor: '#FF6F1E'
    }).then((result) => {
      if (result.isConfirmed) {
        this.remove_localstorage();
        
        Swal.fire({
          icon: 'success',
          title: '¡Carrito limpio!',
          text: 'El carrito se vació correctamente.',
          confirmButtonColor: '#FF6F1E'
        })
      }
    })
  }
  
  get_best_total_price() {
    if (this.total_santa === 0) {
      if (this.total_unimarc === 0) {
        return this.total_jumbo;
      }
      return Math.min(this.total_jumbo, this.total_unimarc);
    }
    
    if (this.total_jumbo === 0) {
      if (this.total_unimarc === 0) {
        return this.total_santa;
      }
      return Math.min(this.total_santa, this.total_unimarc);
    }
  
    if (this.total_unimarc === 0) {
      return Math.min(this.total_santa, this.total_jumbo);
    }
  
    return Math.min(this.total_santa, this.total_jumbo, this.total_unimarc);
  }
  
  get_date() {
    var new_fecha = new Date();
    var dd = String(new_fecha.getDate()).padStart(2, '0');
    var mm = String(new_fecha.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = String(new_fecha.getFullYear());
    return mm + '/' + dd + '/' + yyyy;
  }
  
  values_query(id_cotizacion:number):string {
    var query:string = "";
    for(let i=0; i<this.ListRow.length; i++) {
      query = query + '(' + id_cotizacion + ',' + this.ListRow[i].id_producto + ',' + this.ListRow[i].multiplicador + ')';
      if (i < this.ListRow.length-1) {
        query = query + ', ';
      } else {
        query = query + ';';
      }
    }
    
    return query;
  }
  
  /*save_cart() {
    Swal.fire({
      icon: 'warning',
      title: '¡Cuidado!',
      text: 'Si aceptas finalizará tu cotización actual.',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#FF6F1E'
    }).then((result) => {
      if (result.isConfirmed) {    
        var monto_total = this.get_best_total_price();
        var fecha = this.get_date();
        var token = localStorage.getItem('token') ?? '';
        var decodetoken = this.helper.decodeToken(token);
        var id_usuario: number = decodetoken['data']['id_usuario'];
  
        // Create the cotizacion and handle the response
        this.http.PostCotizacion(id_usuario, monto_total, fecha).subscribe(cotizacionResponse => {
          var id_cotizacion = cotizacionResponse['item']['id_cotizacion'];
          console.log('Cotizacion ID:', id_cotizacion); // Add this log
  
          // Now that you have the id_cotizacion, you can create cotizaciones_productos
          var values: string = this.values_query(id_cotizacion);
          console.log('Cotizacion Productos Values:', values); // Add this log
  
          // Create cotizaciones_productos and handle the response
          this.http.PostCotizacionProductos(values).subscribe(cotizacionProductosResponse => {
            console.log('Cotizacion Productos Response:', cotizacionProductosResponse); // Add this log
  
            Swal.fire({
              icon: 'success',
              title: '¡Cotización guardada!',
              text: 'La cotización se guardó exitosamente.',
              confirmButtonColor: '#FF6F1E'
            }).then(a => {
              this.remove_localstorage();
              this.router.navigate(['history']);
            });
          });
        });
      }
    });
  }

  /*save_cart() {
    Swal.fire({
      icon: 'warning',
      title: '¡Cuidado!',
      text: 'Si aceptas finalizará tu cotización actual.',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#FF6F1E'
    }).then((result) => {
      if (result.isConfirmed) {    
        var monto_total = this.get_best_total_price();
        var fecha = this.get_date();
        var token = localStorage.getItem('token') ?? '';
        var decodetoken = this.helper.decodeToken(token);
        var id_usuario:number = decodetoken['data']['id_usuario'];
  
        // Step 1: Save the cotizacion
        this.http.PostCotizacion(id_usuario, monto_total, fecha).subscribe(datos => {
          var id_cotizacion = datos['item']['id_cotizacion'];
  
          // Step 2: Prepare data for cotizaciones_productos
          var values = this.prepareCotizacionesProductosData(id_cotizacion);
  
          // Step 3: Save cotizaciones_productos
          this.http.PostCotizacionProductos(values).subscribe(() => {
            // Step 4: Clear the cart and navigate to history
            this.remove_localstorage();
            this.router.navigate(['history']);
          });
        });
      }
    });
  }

  prepareCotizacionesProductosData(id_cotizacion: number): string {
    var query = "";
    for(let i = 0; i < this.ListRow.length; i++) {
      query = query + `(${id_cotizacion}, ${this.ListRow[i].id_producto}, ${this.ListRow[i].multiplicador})`;
      if (i < this.ListRow.length - 1) {
        query = query + ', ';
      } else {
        query = query + ';';
      }
    }
    return query;
  }*/

  save_cart() {
    Swal.fire({
      icon: 'warning',
      title: '¡Cuidado!',
      text: 'Si aceptas finalizará tu cotización actual.',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#FF6F1E'
    }).then((result) => {
      if (result.isConfirmed) {    
        Swal.fire({
          icon: 'success',
          title: '¡Cotización guardada!',
          text: 'La cotización se guardó exitosamente.',
          confirmButtonColor: '#FF6F1E'
        }).then(a => {
          this.remove_localstorage();
          this.router.navigate(['history']);
        })
      }
    })
  
    var monto_total = this.get_best_total_price();
    var fecha = this.get_date();
    var token = localStorage.getItem('token') ?? '';
    var decodetoken = this.helper.decodeToken(token)
    var id_usuario:number = decodetoken['data']['id_usuario']

    this.http.PostCotizacion(id_usuario, monto_total, fecha).subscribe(datos => {
      var id_cotizacion = datos['item']['id_cotizacion'];
      var values:string;
      values = this.values_query(id_cotizacion);
      this.http.PostCotizacionProductos(values).subscribe();
    })

    }

    postCotizacionProductos(values: string) {
      this.http.PostCotizacionProductos(values).subscribe(cotizacionProductosResponse => {
        console.log('Cotizacion Productos Response:', cotizacionProductosResponse); // Add this log
    
        Swal.fire({
          icon: 'success',
          title: '¡Cotización guardada!',
          text: 'La cotización se guardó exitosamente.',
          confirmButtonColor: '#FF6F1E'
        }).then(a => {
          this.remove_localstorage();
          this.router.navigate(['history']);
        });
      });
    }
  
  isLoggedIn():boolean {
    return this.login.loggedIn();
  }
}
