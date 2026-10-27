import { Interface } from "readline";
import { apiFetch } from "./client";
import { loginInterface } from "./auth";


export interface centroInterface {
  $id: string;
  Empresa: string;
  Nombre_Empresa: string;
  Nit: string;
  Ciudad: string;
  CodHabilitacion: string;
  CodPrestador: string;
  NombreComercial: string;
}


export async function getCentros(){

    return apiFetch<centroInterface[]>("/api/centros",{
        method: "POST",
    })
}