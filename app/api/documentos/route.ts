import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request : Request){

    const tipo = await request.json();
    const store = await cookies();

    const token = store.get("token")?.value.toString();

    if (!token) {
        return NextResponse.json({ Message: "Acceso no Autorizado" }, { status: 401 });
    }

    const res = await fetch(process.env.DOCUMENT_TYPES_API_URL!, {

        method: "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },
        body: JSON.stringify({TipoDoc : tipo.TipoDoc})
    });
    console.log("tipo recibido:", tipo.TipoDoc);
    const data = await res.json();

    return NextResponse.json(data, {status : res.status})
}