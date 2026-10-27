import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { Caso } = await request.json();              

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ Message: "Acceso no Autorizado" }, { status: 401 });
  }

  const res = await fetch(process.env.PATIENTS_API_URL!, {   
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Caso }),                     
  });

  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}

  return NextResponse.json(data, { status: res.status });
}