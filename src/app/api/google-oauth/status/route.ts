// src/app/api/google-oauth/status/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/app/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("documentId");
    const user = await currentUser();
    const userId = user?.id;
    if (!userId || !documentId) return NextResponse.json({ connected: false });

    // Check if the document has a spreadsheetId
    const document = await prisma.document.findUnique({ where: { id: documentId, userId } });
    return NextResponse.json({ connected: !!document?.spreadsheetId });
}
