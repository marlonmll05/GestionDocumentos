import { apiFetch } from "./client";

export interface Documentos{
    $id : string
    TipoDoc: string
    Descripcion: string
    Unico: string
    Estado: string
    Anexo: string
}

export async function getDocumentos(tipo : string){
    return apiFetch<Documentos[]>("/api/documentos", {
        
        method: "POST",
        body: JSON.stringify({TipoDoc : tipo})
    });


}