/*export interface ProductBestPrice {
    id_producto: number,
    nombre: string,
    marca: string,
    imagen: string,
    precio_normal: string,
    precio_oferta: string
}*/


export interface ProductBestPrice {
    id_producto: number;
    nombre: string;
    marca: string;
    imagen: string;
    precio_normal: string;
    precio_oferta: string;
    supermarkets: {
      id_supermercado: number;
      supermercado: string;
      logo: string;
    }[];
  }
  
  
