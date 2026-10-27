

import { apiFetch } from "./client";


export interface loginInterface{
    servidor : string | undefined,
    usuario : string | undefined,
    password : string | undefined
}

export async function login(data : loginInterface){


    return apiFetch("/api/login", 

        {
            method: "POST",
            body: JSON.stringify({
                Ip_Conexion: data.servidor,
                Username: data.usuario,
                PassWordUsu: data.password
            }),
        }

    );
}