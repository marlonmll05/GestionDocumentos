import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(){
    const store = await cookies();
    const ipConexion = store.get("server")?.value.toString();
    const username = store.get("username")?.value.toString();
    const password = store.get("password")?.value.toString();
    const token = store.get("token")?.value.toString();

    console.log(ipConexion, username, password, token);
    

    if (!token || !ipConexion || !username) {
        return NextResponse.json({ Message: "Acceso no Autorizado" }, { status: 401 });
    }


    const res = await fetch(process.env.COMPANIES_USER_API_URL!, {

        method: "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },
        body : JSON.stringify({
            IpConexion: ipConexion,
            Usuario: username,
            PasswordUsu: password
        })
    });

    const data = await res.json();

    return NextResponse.json(data, {status : res.status})
}