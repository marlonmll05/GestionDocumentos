import { Interface } from "readline";
import { apiFetch } from "./client";
import { loginInterface } from "./auth";


export interface DigitalInterface {
  $id: string;
  CodCentro: number;
  Nombre: string;
  Empresa: string;
  ruta: string;
  tipo: string;
  remoto: string;
  CodSoporteFact: string;
}


export async function getCentrosDigitalizacion(empresa : string){

    return apiFetch<DigitalInterface[]>("/api/digital",{
        method: "POST",
        body: JSON.stringify({Empresa : empresa})
    })
}