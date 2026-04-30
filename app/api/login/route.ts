import { NextResponse } from "next/server";
import User from "../../model/user";
import DBConnection from "../../lib/db";

export async function POST(req: Request) {
  try {
    await DBConnection();

    const body = await req.json();

    // console.log("BODY:", body);

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    const user = await User.findOne({ email });

    // console.log("FOUND USER:", user);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
return NextResponse.json({
  message: "Login success",
  user: {
    id: user._id,
    email: user.email,
    name: user.name,
  },
});

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
