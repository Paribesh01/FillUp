import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { documentId, content } = await req.json();

    const submission = await prisma.submission.create({
        data: {
            documentId,
            userId: user.id,
            content,
        },
    });

    return NextResponse.json({ submission });
}
