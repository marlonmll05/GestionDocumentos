import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request : Request){

    const centroDigital = await request.json();
    const store = await cookies();

    const token = store.get("token")?.value.toString();

    if (!token) {
        return NextResponse.json({ Message: "Acceso no Autorizado" }, { status: 401 });
    }

    const res = await fetch(process.env.DIGITAL_CENTER_API_URL!, {

        method: "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },
        body: JSON.stringify({Empresa: centroDigital.Empresa})
    });
    
    console.log("Empresa recibida", centroDigital.Empresa);
    const data = await res.json();
    console.log(data);

    return NextResponse.json(data, {status : res.status})
}