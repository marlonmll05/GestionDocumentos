import { StringValidation } from "zod";
import { apiFetch } from "./client";


export interface Servidor{
    $id : string,
    Ip_Conexion : string, 
    Descripcion : string
}

export async function getServers(){

    return apiFetch<Servidor[]>("/api/servidores")
}