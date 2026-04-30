import { NextResponse } from "next/server";

const users = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@test.com`,
}));

export async function GET(req: Request) {
  const url = new URL(req.url);

  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 10);
  const search = url.searchParams.get("search") || "";
  const sortBy = url.searchParams.get("sortBy") || "id";
  const order = url.searchParams.get("order") || "asc";

  const token = req.headers.get("authorization");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  filtered.sort((a: any, b: any) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (typeof valA === "string") {
      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return order === "asc" ? valA - valB : valB - valA;
    }
  });

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    total: filtered.length,
  });
}