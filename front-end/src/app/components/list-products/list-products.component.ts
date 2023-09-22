import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductBestPrice } from 'src/app/interfaces/product-best-price';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  ListaProductos = new Array<ProductBestPrice>();
  flag_alert:boolean = false;
  add_product_name:string = '';

  constructor(private http: ProductosService, private notificationService: NotificationService) {}


  ngOnInit(): void {
    
    this.http.GetMostViewProductsDay().subscribe(datos => {
      for(let i=0; i<datos.items.length; i++) {
        this.ListaProductos.push(datos.items[i]);
      }

    })
  }



  product_on_offer(precio_oferta:string) {
    if (precio_oferta == '999999999') {
      return false;
    }
    return true;
  }
  
  numberWithPoints(precio:string) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  onImgError(event:any) { 
    event.target.src = '../../../assets/icon-alert.png';
  }
  
  async add_product_cart(id_producto:number, nombre:string, marca:string, imagen:string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-start',
      showConfirmButton: false,
      timer: 2500,
      background: '#ededed',
      color: '#575757',
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Agregado con éxito.',
      text: nombre
    })
  
    let products = JSON.parse(localStorage.getItem('cart')!) || [];
    
    for(let i=0; i<products.length; i++) {
      if(products[i]['id_producto'] == id_producto) {
        products[i]['multiplicador'] = products[i]['multiplicador'] + 1;
        localStorage.setItem('cart', JSON.stringify(products));
        
        this.flag_alert = true;
        this.add_product_name = nombre;
        await this.delay(3000);
        this.flag_alert = false;
        return
      }
    }
    
    products.push({id_producto: id_producto, nombre: nombre, marca: marca, imagen: imagen, multiplicador: 1});
    localStorage.setItem('cart', JSON.stringify(products));
    return
  }
  
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms));
  }
}