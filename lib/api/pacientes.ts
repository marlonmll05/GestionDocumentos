import { apiFetch } from "./client";

export interface Paciente {
  $id: string;
  Nombre1: string;      // ??? real field names from the JSON
  Nombre2: string;
  Apellido1: string;
  Apellido2: string;
}

export function nombreCompleto(p: Paciente) {
  return [p.Nombre1, p.Nombre2, p.Apellido1, p.Apellido2].filter(Boolean).join(" ");
}

export async function buscarPacientes(caso: string) {
  return apiFetch<Paciente[]>("/api/pacientes", {
    method: "POST",
    body: JSON.stringify({ Caso: caso }),      // ??? exact parameter name
  });
}