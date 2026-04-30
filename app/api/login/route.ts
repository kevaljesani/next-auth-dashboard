// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "admin@test.com" && password === "123456") {
    return NextResponse.json({
      token: "mock-token-123",
    });
  }

  return NextResponse.json(
    { message: "Invalid credentials" },
    { status: 401 }
  );
}