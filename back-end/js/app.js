"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_preferencia_1 = require("./UsuariosPreferencias/get_preferencia");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./connect_database');
app.use(bodyParser.json());
const getPreferenciaRouter = require('./UsuariosPreferencias/get_preferencia').default;
const postPreferenciaRouter = require('./UsuariosPreferencias/post_preferencia').default;
const updatePreferenciaRouter = require('./UsuariosPreferencias/update_preferencia').default;
const fetchPreferenciaRouter = require('./UsuariosPreferencias/fetch_preferencias').default;
const getSavedLowestPriceRouter = require('./UsuariosPreferencias/get_saved_lowest_price').default;
const GetProductoFunctions = require('./Productos/get_producto');
const getNotificationsRouter = require('./Notificaciones/get_notifications').default;
const postNotificationsRouter = require('./Notificaciones/post_notifications').default;
/* Imports GET */
const Producto = require('./Productos/get_producto');
const ListProducto = require('./Productos/get_list_products');
const ListCategorias = require('./Categorias/get_list_categories');
const ListSuperProducts = require('./Supermercados_Productos/get_list_product_id');
const Categoria = require('./Categorias/get_category');
const ListProductosCategoria = require('./Productos/get_list_products_category');
const ListProductsBestPrice = require('./Productos/get_list_products_best_price');
const Usuario = require('./Usuarios/get_user');
const ProductsFilter = require('./Filter/get_products_filter');
const TotalProductsFilter = require('./Filter/get_total_filter');
const ListSupermarkets = require('./Supermercados/get_supermarkets');
const ProductsCart = require('./Cart/get_products_cart');
const AllProductsName = require('./Productos/get_all_products_name');
const CotizacionesUsuario = require('./Cotizaciones/get_cotizaciones_user');
const CotizacionesProductos = require('./CotizacionesProductos/get_productos_cotizaciones');
const TotalCotizacionUser = require('./Cotizaciones/get_total_cotizaciones_user');
const MostViewProducts = require('./Productos/get_most_view_products_day');
/* Imports POST */
const InsertarUsuario = require('./Usuarios/post_user');
const Login = require('./Usuarios/post_login');
const BrandsFilter = require('./Filter/post_brands_filter');
const CategoriesFilter = require('./Filter/post_categories_filter');
const TypesFilter = require('./Filter/post_types_filter');
const InsertarCotizacion = require('./Cotizaciones/post_cotizacion');
const InsertarCotizacionProductos = require('./CotizacionesProductos/post_cotizaciones_productos');
const config = {
    hostname: "127.0.0.1",
    port: 3000,
};
app.use(cors());
app.use('/usuarios-preferencias', getPreferenciaRouter);
app.use('/usuarios-preferencias', postPreferenciaRouter);
app.use('/usuarios-preferencias', updatePreferenciaRouter);
app.use('/usuarios_preferencias', fetchPreferenciaRouter);
app.use('/usuarios-preferencias', getSavedLowestPriceRouter);
//app.use('/notificaciones/get/:userId', getNotificationsRouter);
app.use('/notificaciones/post/:userId', postNotificationsRouter);
app.get('/notificaciones/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch notifications from the database based on the userId
        const userId = req.params.userId;
        const query = 'SELECT message FROM notificaciones WHERE id_usuario = $1';
        const values = [userId];
        const result = yield pool.query(query, values);
        // Extract the "message" column from the database result
        const notifications = result.rows.map((row) => row.message);
        // Send the notifications as an array to the client
        res.json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
//app.get('/Producto/:id/lowestprice', Producto.GetLowestPriceProducto);
app.get('/Productos/:productId/GetLowestPriceForProduct', Producto.GetLowestPriceProducto);
//app.get('/Productos/:productId/GetProductoName', Producto.GetProductoName);
app.get('/Productos/:productId/get-product-name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.productId);
    try {
        // Call the GetProductoName function to get the product name
        const productName = yield GetProductoFunctions.GetProductoName(productId);
        if (productName !== null) {
            console.log(`Product Name for ID ${productId}: ${productName}`);
            res.json({ productName });
        }
        else {
            console.log(`Product Name not found for ID ${productId}`);
            res.status(404).json({ error: 'Product not found' });
        }
    }
    catch (error) {
        console.error('Error fetching product name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
//app.put('/usuarios-preferencias/:productId/UpdateLowestPrice', updatePreferenciaRouter);
app.get('/usuarios-preferencias/:userId/:productId', getSavedLowestPriceRouter);
/* GET methods */
app.get('/Producto/:id', Producto.GetProducto);
app.get('/ListProductos', ListProducto.GetListProductos);
app.get('/ListCategorias', ListCategorias.GetListCategorias);
app.get('/ListSupermercadosProductos/:id', ListSuperProducts.GetListSuperProductsId);
app.get('/Categoria/:id', Categoria.GetCategory);
app.get('/ProductosCategoria/:id', ListProductosCategoria.GetListProductosCategoria);
app.get('/ListProductsBestPrice', ListProductsBestPrice.GetListProductsBestPrice);
app.get('/Usuario/:email', Usuario.GetUser);
app.get('/FilterProducts/:categoria/:marca/:tipo/:precio_inicial/:precio_final/:offset', ProductsFilter.GetProductsFilter);
app.get('/TotalFilter/:categoria/:marca/:tipo/:precio_inicial/:precio_final', TotalProductsFilter.GetTotalProductsFilter);
app.get('/Supermarkets', ListSupermarkets.GetSupermarkets);
app.get('/ProductsCart/:ids', ProductsCart.GetProductsCart);
app.get('/AllProductsName/:search', AllProductsName.GetAllProductsName);
app.get('/CotizacionesUsuario/:id/:offset', CotizacionesUsuario.GetCotizacionesUsuario);
app.get('/CotizacionesProductos/:id', CotizacionesProductos.GetCotizacionProductos);
app.get('/TotalCotizacionesUser/:id', TotalCotizacionUser.GetTotalCotizacionUser);
app.get('/MostViewProductos', MostViewProducts.GetMostViewProductsDay);
app.get('/usuarios-preferencias/is-subscribed/:userId/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
        const userIsSubscribed = yield (0, get_preferencia_1.isSubscribed)(userId, productId);
        console.log('Received userId:', userId);
        console.log('Received productId:', productId);
        if (userIsSubscribed) {
            res.json({ message: 'User is subscribed to the product' });
        }
        else {
            res.json({ message: 'User is not subscribed to the product' });
        }
    }
    catch (error) {
        console.error('Error checking user subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get('/usuarios-preferencias/all-subscribed-products', (req, res) => {
    const query = `
  SELECT up.id_usuario, up.id_producto, p.nombre AS producto_nombre, up.lowest_price
  FROM usuarios_preferencias AS up
  INNER JOIN productos AS p ON up.id_producto = p.id_producto
  `;
    pool.query(query, (err, response) => {
        if (err) {
            console.error('Error fetching subscribed products:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const subscribedProducts = response.rows;
        res.json({ subscribedProducts });
    });
});
app.delete('/usuarios-preferencias/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const productId = req.query.productId;
    try {
        const query = 'DELETE FROM usuarios_preferencias WHERE id_usuario = $1 AND id_producto = $2';
        yield pool.query(query, [userId, productId]);
        res.json({ message: 'User preference deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user preference:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// ... Define other routes and middleware ...
//const port = process.env.PORT || 3000;
//app.listen(port, () => {
//  console.log(`Server is running on port ${port}`);
//});
/* POST methods */
app.post('/InsertarUsuario', bodyParser.json(), InsertarUsuario.PostUsuario);
app.post('/Login', bodyParser.json(), Login.PostLogin);
app.post('/FilterBrand', bodyParser.json(), BrandsFilter.PostBrandsFilter);
app.post('/FilterCategory', bodyParser.json(), CategoriesFilter.PostCategoriesFilter);
app.post('/FilterType', bodyParser.json(), TypesFilter.PostTypesFilter);
app.post('/InsertarCotizacion', bodyParser.json(), InsertarCotizacion.PostCotizacion);
app.post('/InsertarCotizacionProductos', bodyParser.json(), InsertarCotizacionProductos.PostCotizacionesProductos);
app.listen(config, () => {
    console.log(`Conectando al servidor http://${config.hostname}:${config.port}`);
});
