

import { apiFetch } from "./client";


interface loginInterface{
    usuario : string,
    password : string
}

export async function login(data : loginInterface){


    return apiFetch("/api/login", 

        {
            method: "POST",
            body: JSON.stringify({
                Username: data.usuario,
                PassWordUsu: data.password
            }),
        }

    );
}