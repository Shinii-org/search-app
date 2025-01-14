import { auth } from "@/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorize", status: 401 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";

  const keywords = await db.keyword.findMany({
    where: {
      users: {
        some: {
          id: session.user.id,
        },
      },
      value: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  return NextResponse.json(keywords, { status: 200 });
}
