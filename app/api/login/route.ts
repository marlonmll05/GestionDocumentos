import { NextResponse } from "next/server";

export async function POST(request : Request){
    
    const body = await request.json();

    const res = await fetch(process.env.TOKENJWT_API_URL!, {    

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    console.log(res.status, data);

    const response = NextResponse.json(data, { status: res.status });
    
    const cookieOptions = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    };

    if (res.ok) {
        response.cookies.set("token", data.token, cookieOptions);
        response.cookies.set("server", data.ipconexion, cookieOptions);
        response.cookies.set("username", data.usuario, cookieOptions);
        response.cookies.set("password", data.passusu, cookieOptions);
    }

    return response;
        
}