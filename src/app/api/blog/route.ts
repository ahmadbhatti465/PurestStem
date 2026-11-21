import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { livePostWhere } from "@/lib/visibility";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: livePostWhere(),
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
