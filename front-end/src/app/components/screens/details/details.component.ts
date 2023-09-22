import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';
import { SupermercadosProductosService } from 'src/app/services/supermercados-productos.service';
import { SupermercadosProductos } from 'src/app/interfaces/supermercados-productos';
import { Product } from 'src/app/interfaces/product';
import { ProductBestPrice } from 'src/app/interfaces/product-best-price';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { UsuariosPreferencias } from 'src/app/interfaces/usuarios-preferencias'
import { UsuariosPreferenciasService } from 'src/app/services/usuarios-preferencias.service'
import { NotificationService } from 'src/app/services/notification.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  lowestPrice: number | null = null; // Initialize with null

  previousSupermarketData: SupermercadosProductos[] = []; // Track previous data

  subscribeToProduct: boolean = false; // Initialize the checkbox value

  isLoggedIn():boolean {
    return this.http_login.loggedIn();
  }
  

  id_producto:any;
  Producto:Product;
  ListaSuperProducto = new Array<SupermercadosProductos>();
  flag_alert:boolean = false;

  constructor(
     private sanitizer: DomSanitizer,
     private notificationService: NotificationService,
     private http: ProductosService, 
     private userPreferencesService: UsuariosPreferenciasService, 
     private http_login:LoginService, 
     private route: ActivatedRoute, 
     private httpProduct:ProductosService, 
     private httpSuperProduct:SupermercadosProductosService
     ) {    
    this.Producto = {
      id_producto: 0,
      categoria: '',
      marca: '',
      tipo_producto: '',
      nombre: '',
      imagen: '',
      descripcion: '',
      ingredientes: ''
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      console.log('Product ID:', productId);

      // Check if the user is subscribed to this product
      const userId = this.userPreferencesService.get_id_usuario();
      this.userPreferencesService.isUserSubscribed(userId, productId).subscribe((response) => {
        // Check the response message to determine subscription status
        if (response.message === 'User is subscribed to the product') {
          this.subscribeToProduct = true;
        } else {
          this.subscribeToProduct = false;
        }

        // Update the checkbox status based on the response
        //this.subscribeToProduct = response.subscribed;
        // Fetch and display the product details
        this.get_product();
        this.get_list_supermarket();

        // Fetch and check all products for price decrease
        this.fetchAndCheckAllProductsForPriceDecrease();

        
      });
    });

    

    this.cambioDeRuta();
  }

  fetchAndCheckAllProductsForPriceDecrease() {
    this.userPreferencesService.getAllSubscribedProducts().subscribe(
      (response: any) => { // Explicitly specify 'response' as 'any' type
        const products = response.subscribedProducts;
        console.log('Products:', products);
        for (const product of products) {
          console.log('Product ID:', product.id_producto);
          console.log('User ID:', product.id_usuario);
          this.checkForPriceDecrease(product.id_producto, product.id_usuario);
        }
      },
      (error) => {
        console.error('Error fetching subscribed products:', error);
        // Handle the error as needed
      }
    );
  }

  notificationMessage: string = '';
  /*checkForPriceDecrease(productId: number, userId: number) {
    this.http.GetLowestPriceProducto(productId).subscribe((response: any) => {
      const currentLowestPrice = response.currentLowestPrice;
      console.log(`Checking price for Product ${productId}...`);
      console.log(`Lowest Price: ${currentLowestPrice}`);
      const productDetailURL = `/details/${productId}`;
      
      // Fetch the product name
      this.http.GetProductoName(productId).subscribe((response:any) => {
        const productName = response.productName;
        console.log(`Product Name: ${productName}`);
        if (currentLowestPrice !== null) {
          // Compare the current lowest price with the saved lowest price.
          this.httpProduct.GetSavedLowestPrice(productId, userId).subscribe(savedLowestPrice => {
            if (currentLowestPrice < savedLowestPrice) {
              console.log(`Saved Lowest Price from Usuarios_Preferencias: ${savedLowestPrice}`);
              const productDetailURL = `/details/${productId}`; // Adjust the URL as needed
              const notificationMessage = this.createSafeHtmlMessage(productName, productDetailURL);
              // Trigger a notification here with the safe HTML message
              this.notificationService.addNotification(notificationMessage);
              // Update the saved lowest price with the current save price.
              //this.http.UpdateLowestPriceForProduct(productId, currentLowestPrice).subscribe(() => {
              //  console.log(`Saved lowest price updated for Product ${productId}.`);
              //});
            }
          });
        } else {
          console.log(`Could not retrieve the current lowest price for Product ${productId}.`);
        }
      });
    });
  }*/
  checkForPriceDecrease(productId: number, userId: number) {
    console.log(`Checking price for Product ${productId} for User ${userId}...`);
    this.http.GetLowestPriceProducto(productId).subscribe((response: any) => {
      const currentLowestPrice = response.currentLowestPrice;
      console.log(`Checking price for Product ${productId}...`);
      console.log(`Lowest Price: ${currentLowestPrice}`);
      const productDetailURL = `/details/${productId}`;
  
      // Fetch the product name
      this.http.GetProductoName(productId).subscribe((response: any) => {
        const productName = response.productName;
        console.log(`Product Name: ${productName}`);
        if (currentLowestPrice !== null) {
  
          // Compare the current lowest price with the saved lowest price.
          this.httpProduct.GetSavedLowestPrice(productId, userId).subscribe(savedLowestPrice => {
            if (currentLowestPrice < savedLowestPrice) {
              console.log(`Saved Lowest Price from Usuarios_Preferencias: ${savedLowestPrice}`);

              // Create the notification message
              const notificationMessage = `El producto ${productName} bajó de precio. <a href="${productDetailURL}">Click para ver.</a>`;
              
              // Create the notification object with id_usuario, id_producto, and message
              const notificationData = {
                id_usuario: userId,
                id_producto: productId,
                message: notificationMessage
              };

              //const notificationMessage = this.createSafeHtmlMessage(productName, productDetailURL);
              
              // Trigger a notification here with the safe HTML message
              this.notificationService.addNotification(notificationData);
              // Update the saved lowest price with the current save price.
              //this.http.UpdateLowestPriceForProduct(productId, currentLowestPrice).subscribe(() => {
              //  console.log(`Saved lowest price updated for Product ${productId}.`);
              //});
            }
          });
        } else {
          console.log(`Could not retrieve the current lowest price for Product ${productId}.`);
        }
      });
    });
  }
  
  
  createSafeHtmlMessage(productName: string, productDetailURL: string): string {
    // Create an anchor element with a link to the product
    const anchorElement = `<a href="${productDetailURL}">Click para ver.</a>`;
    
    // Create the message with the product name and the anchor element
    return `El producto ${productName} bajó de precio. ${anchorElement}`;
  }
  

  onSubscribeCheckboxChange(): void {
    // Extract productId from the URL
    console.log('Checkbox State:', this.subscribeToProduct);
    this.route.params.subscribe(params => {
      const productId = +params['id']; // 'id' matches the parameter name in the route config
      console.log('Product ID:', productId); // Debugging - check if productId is correctly extracted
      const userId = this.userPreferencesService.get_id_usuario();
  
      if (productId && userId) {
        if (this.subscribeToProduct) {
          // Checkbox is checked, save the user preference
          this.userPreferencesService.saveUserPreference(productId, userId)
            .subscribe((response) => {
              // Handle success response if needed
              console.log('User preference saved:', response);
            });
        } else {
          // Checkbox is unchecked, delete the user preference
          this.userPreferencesService.deleteUserPreference(productId, userId)
            .subscribe((response) => {
              // Handle success response if needed
              console.log('User preference deleted:', response);
            });
        }
      } else {
        console.error('Product ID or User ID is missing.');
      }
    });
  }
  
  
  

  get_product():void {
    this.httpProduct.GetProducto(this.id_producto).subscribe(datos => {
      this.Producto = datos[0];
    })
  }
  
  /*get_list_supermarket(): void {
    this.ListaSuperProducto = [];
    this.httpSuperProduct.GetListSuperProductsId(this.id_producto).subscribe(datos =>{
      for(let i=0; i<datos.items.length; i++) {
        this.ListaSuperProducto.push(datos.items[i]);
        this.ListaSuperProducto[i].fecha = this.convert_date(datos.items[i].fecha)
      }
    })
  }*/

  get_list_supermarket(): void {
    this.ListaSuperProducto = [];
    this.httpSuperProduct.GetListSuperProductsId(this.id_producto).subscribe((datos) => {
      for (let i = 0; i < datos.items.length; i++) {
        const item = datos.items[i];
        item.fecha = this.convert_date(item.fecha);

        // Check if the item data is the same as the previous data
        const isSameData = this.previousSupermarketData.some((prevItem) =>
          this.isSameSupermarketData(prevItem, item)
        );

        if (!isSameData) {
          this.ListaSuperProducto.push(item);
          this.previousSupermarketData.push(item); // Store this item as previous data
        }
      }
    });
  }
  isSameSupermarketData(item1: SupermercadosProductos, item2: SupermercadosProductos): boolean {
    return (
      item1.supermercado === item2.supermercado &&
      item1.fecha === item2.fecha &&
      item1.precio_normal === item2.precio_normal &&
      item1.precio_oferta === item2.precio_oferta &&
      item1.disponibilidad === item2.disponibilidad
    );
  }
  
  onImgError(event:any) { 
    event.target.src = '../../../assets/icon-alert.png';
  }
  
  convert_date(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      // Check if the input is a string (unformatted date)
      const dateParts = fecha.split('-'); // Assuming the unformatted date is in 'YYYY-MM-DD' format
      if (dateParts.length === 3) {
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2].split('T')[0]; // Remove time part if present
        return `${day}/${month}/${year}`;
      }
    } else if (fecha instanceof Date) {
      // Check if the input is a Date object (formatted date)
      const dd = String(fecha.getDate()).padStart(2, '0');
      const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = String(fecha.getFullYear());
      return `${dd}/${mm}/${yyyy}`;
    }
    
    return fecha.toString(); // Return the original value if unable to convert
  }
  
  exists_ingredients(ingredients:string) {
    if (ingredients == 'No disponible') {
      return false
    }
    return true
  }
  
  numberWithPoints(precio:string) {
    if (precio != '-') {
      return '$ ' + precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return '-'
  }
  
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  
  async add_product_cart(id_producto:number, nombre:string, marca:string, imagen:string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      background: '#ededed',
      color: '#575757',
      timer: 2500,
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
  
    let products = JSON.parse(localStorage.getItem('cart')!)|| [];
    
    for(let i=0; i<products.length; i++) {
      if(products[i]['id_producto'] == id_producto) {
        products[i]['multiplicador'] = products[i]['multiplicador'] + 1;
        localStorage.setItem('cart', JSON.stringify(products));
        
        this.flag_alert = true;
        await this.delay(3000);
        this.flag_alert = false;
        return
      }
    }
    
    products.push({id_producto: id_producto, nombre: nombre, marca: marca, imagen: imagen, multiplicador: 1});
    localStorage.setItem('cart', JSON.stringify(products));
  }
  
  cambioDeRuta(): void {
    this.route.params.subscribe(params => {
      this.id_producto = params['id'];
      this.get_product();
      this.get_list_supermarket();
   });
  }
}
