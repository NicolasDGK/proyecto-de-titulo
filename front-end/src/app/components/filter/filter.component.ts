import { Component, OnInit } from '@angular/core';
import { ProductBestPrice } from 'src/app/interfaces/product-best-price';
import { FilterService } from 'src/app/services/filter.service';
import { Categorias } from 'src/app/interfaces/categorias';
import { Marca } from 'src/app/interfaces/marca';
import { Tipo } from 'src/app/interfaces/tipo';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  flag_alert:boolean = false;
  add_product_name:string = '';

  value_type:any = null;
  value_category:any = null;
  value_brand:any = null;
  filter_form:FormGroup;
  
  total_products:number = 0;
  offset:number = 0;
  flag_pagination:boolean = false;
  flag_previous:boolean = false;
  flag_next:boolean = true;
  
  inicial_price:any = 0;
  final_price:any = 0;

  ListProductos = new Array<ProductBestPrice>();
  ListCategorias = new Array<Categorias>();
  ListMarcas = new Array<Marca>();
  ListTipos = new Array<Tipo>();

  constructor(private http_filter:FilterService, private fb:FormBuilder) {
    this.filter_form = this.fb.group({});
  }

  ngOnInit(): void {   
    this.http_filter.PostFilterCategory(this.value_brand, this.value_type).subscribe(datos => {
      for(let i=0; i<datos.items.length; i++) {
        this.ListCategorias.push(datos.items[i]);
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

  selectCategory(id_category:any) {   
    this.value_category = id_category;
    
    if(this.value_category == 'null') {
      this.value_category = null
    }
  
    this.ListMarcas = [];
    this.value_brand = null;
    this.http_filter.PostFilterBrand(this.value_category, this.value_type).subscribe(datos => {
      for(let i=0; i<datos.items.length; i++) {
        this.ListMarcas.push(datos.items[i]);
      }
    })
    
    this.ListTipos = [];
    this.value_type = null;
      this.http_filter.PostFilterType(this.value_brand, this.value_category).subscribe(datos => {
        for(let i=0; i<datos.items.length; i++) {
          this.ListTipos.push(datos.items[i]);
        }
      })
  }
  
  selectBrand(id_brand:any) {
    this.value_brand = id_brand;
    
    if(this.value_brand == 'null') {
      this.value_brand = null
    }
       
    if (this.value_type == null) {
      this.ListTipos = [];
      this.http_filter.PostFilterType(this.value_brand, this.value_category).subscribe(datos => {
        for(let i=0; i<datos.items.length; i++) {
          this.ListTipos.push(datos.items[i]);
        }
      })
    }
  }
  
  selectType(id_type:any) {
    this.value_type = id_type;
    
    if(this.value_type == 'null') {
      this.value_type = null;
    }
    
    if (this.value_brand == null) {
      this.ListMarcas = [];
      this.http_filter.PostFilterBrand(this.value_category, this.value_type).subscribe(datos => {
        for(let i=0; i<datos.items.length; i++) {
          this.ListMarcas.push(datos.items[i]);
        }
      })
    }
  }
  
  clear_filters() {
    this.ListProductos = [];
    this.total_products = 0;
    if (this.value_category != null) {
      this.value_brand = null;
      this.value_type = null;
      this.value_category = null;
      
      this.http_filter.PostFilterCategory(null, null).subscribe(datos => {
        for(let i=0; i<datos.items.length; i++) {
          this.ListCategorias.push(datos.items[i]);
        }
      })
    }
  }
  
  refresh_products() {
    this.ListProductos = [];
    this.http_filter.GetProductsFilter(this.value_category, this.value_brand, this.value_type, this.inicial_price, this.final_price, this.offset).subscribe(datos => {
      for(let i=0; i<datos.items.length; i++) {
        this.ListProductos.push(datos.items[i]);
      }
    })
  }
  
  async submit_filter() {
    this.total_products = 0;
    this.offset = 0;
    this.flag_pagination = false;
    this.flag_previous = false;
    this.flag_next = true;
    
    this.inicial_price = (document.getElementById('inicial_price') as HTMLInputElement | null)?.value;
    this.final_price = (document.getElementById('final_price') as HTMLInputElement | null)?.value;
        
    await this.http_filter.GetTotalFilter(this.value_category, this.value_brand, this.value_type, this.inicial_price, this.final_price).subscribe(datos => {
      this.total_products = datos.items;
      
      if (this.total_products > 20) {
        this.flag_pagination = true;
      }
    })
    
    await this.refresh_products();
  }
  
  previous_page() {
    this.offset = this.offset - 20;
    if (this.offset < 0) {
      this.offset = 0;
    }
    
    this.refresh_products();
    
    if (this.offset <= 20) {
      this.flag_previous = false;
    } else {
      this.flag_previous = true;
    }
    
    if (this.offset >= this.total_products) {
      this.flag_next = false;
    } else {
      this.flag_next = true;
    }
  }
  
  next_page() {
    this.offset = this.offset + 20;
    
    this.refresh_products();
    
    if (this.offset < 20) {
      this.flag_previous = false;
    } else {
      this.flag_previous = true;
    }
    
    if (this.offset + 20 >= this.total_products) {
      this.flag_next = false;
    } else {
      this.flag_next = true;
    }
  }
  
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
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
  
  onImgError(event:any) { 
    event.target.src = '../../../assets/icon-alert.png';
  }
}