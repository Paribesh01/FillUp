import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";
import { currentUser } from "@clerk/nextjs/server";
import { google } from "googleapis";

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
    console.log("submission", submission);
    console.log("user", user);

    // Check for Google Sheets integration
    const integration = await prisma.googleIntegration.findUnique({
        where: { userId: user.id },
    });

    console.log("integration", integration);

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    const spreadsheetId = document?.spreadsheetId;

    if (integration && spreadsheetId) {
        // Set up OAuth2 client
        console.log("integration", integration);
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        oauth2Client.setCredentials({
            access_token: integration.accessToken,
            refresh_token: integration.refreshToken,
        });

        const sheets = google.sheets({ version: "v4", auth: oauth2Client });
        console.log("sheets", sheets);

        // You need to decide how to map submissions to sheets.
        // For demo, let's assume you have a fixed spreadsheetId and sheet name.
        // In production, you might want to let users pick/create a sheet.

        const sheetName = "Submissions"; // Or make dynamic

        // Prepare data (flatten content if it's an object)
        const row = [
            new Date().toISOString(),
            documentId,
            user.id,
            typeof content === "string" ? content : JSON.stringify(content),
        ];

        // 1. Check if spreadsheetId exists for this user/document
        // let spreadsheetId = integration.spreadsheetId; // or from another model

        // if (!spreadsheetId) {
        // 2. Create a new spreadsheet
        // const createSheetResponse = await sheets.spreadsheets.create({
        //     requestBody: {
        //         properties: { title: `Submissions for ${user.id} - ${documentId}` },
        //         sheets: [{ properties: { title: "Submissions" } }],
        //     },
        // });
        // spreadsheetId = createSheetResponse.data.spreadsheetId || null;

        // // 3. Save spreadsheetId to DB for future use
        // await prisma.googleIntegration.update({
        //     where: { userId: user.id },
        //     data: { spreadsheetId },
        // });
        // }

        // 4. Append the submission as before
        try {
            await sheets.spreadsheets.values.append({
                spreadsheetId: spreadsheetId || "",
                range: `${sheetName}!A:D`,
                valueInputOption: "RAW",
                requestBody: { values: [row] },
            });
        } catch (err) {
            // Log error, but don't block submission
            console.error("Failed to sync to Google Sheets:", err);
        }
    }

    return NextResponse.json({ submission });
}
