export interface UsuariosPreferencias {
    id?: number; // Optional because the ID might not be known when creating a new preference
    user_id_usuario: number;
    product_id: number;
}