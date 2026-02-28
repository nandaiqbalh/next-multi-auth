// app/api/auth/register/route.js

import { registerAction } from "@/lib/actions/auth.actions";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();  
    const result = await registerAction(body);

    if (!result.success) {
      const status = result.message.includes("already") || result.message.includes("taken") ? 409 : 400;
      return NextResponse.json({ success: false, message: result.message }, { status });
    }

    return NextResponse.json(
      { success: true, message: result.message, user: result.user },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server. Coba lagi." },
      { status: 500 }
    );
  }
}