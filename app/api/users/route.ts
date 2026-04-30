import { NextResponse } from "next/server";
import DBConnection from "../../lib/db";
import User from "../../model/user";

export async function GET(req: Request) {
  try {
    await DBConnection();

    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "id";
    const order = url.searchParams.get("order") === "desc" ? -1 : 1;

    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sort: any = {};
    sort[sortBy] = order;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password") 
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return NextResponse.json({
      data: users,
      total,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
