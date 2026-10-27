import { NextResponse } from "next/server";
import { env } from "process";

export async function GET(){

    const res = await fetch(process.env.SERVERLIST_API_URL!);

    const data = await res.json();

    console.log(res.status, data);

    return NextResponse.json(data, {status : res.status})

    
}