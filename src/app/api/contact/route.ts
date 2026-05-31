import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    const msg = await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject || null,
        message: body.message,
      },
    });

    return NextResponse.json(msg, { status: 201 });
  } catch (err: any) {
    console.error("Contact POST error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
