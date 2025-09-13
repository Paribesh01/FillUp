import { NextRequest, NextResponse } from "next/server";
import { updateFormContent } from "@/app/actions/form";

export async function POST(req: NextRequest) {
    const { docId, content } = await req.json();
    try {
        await updateFormContent(docId, content);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
