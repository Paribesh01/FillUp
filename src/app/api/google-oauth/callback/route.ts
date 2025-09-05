// src/app/api/google-oauth/callback/route.ts

import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

export async function GET(req: NextRequest) {
    // 1. Verify Clerk user
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) return NextResponse.redirect("/sign-in");

    // 2. Extract auth code
    const code = req.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.redirect("/integration-error");

    // 3. Parse state (contains documentId)
    const state = req.nextUrl.searchParams.get("state");
    let documentId = "";
    try {
        documentId = state ? JSON.parse(state).documentId : "";
    } catch {
        documentId = "";
    }
    if (!documentId) return NextResponse.redirect("/integration-error");

    // 4. Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
        console.error("Failed to fetch tokens:", tokenData);
        return NextResponse.redirect("/integration-error");
    }

    // 5. Preserve refreshToken if not returned
    const existing = await prisma.googleIntegration.findUnique({ where: { userId } });

    await prisma.googleIntegration.upsert({
        where: { userId },
        update: {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || existing?.refreshToken,
            expiryDate: new Date(Date.now() + tokenData.expires_in * 1000),
        },
        create: {
            userId,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiryDate: new Date(Date.now() + tokenData.expires_in * 1000),
        },
    });

    // 6. Create Google Sheet
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oauth2Client.setCredentials({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || existing?.refreshToken,
    });

    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const createSheetResponse = await sheets.spreadsheets.create({
        requestBody: {
            properties: { title: `Submissions for ${userId} - ${documentId}` },
            sheets: [{ properties: { title: "Submissions" } }],
        },
    });

    const spreadsheetId = createSheetResponse.data.spreadsheetId;
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    console.log("sheetUrl-------", sheetUrl);

    // 7. Save spreadsheetId + metadata to Document
    await prisma.document.update({
        where: { id: documentId },
        data: {
            spreadsheetId,
        },
    });

    // 8. Redirect back to app
    const origin = req.nextUrl.origin;
    return NextResponse.redirect(`${origin}/form/integration?connected=1`);
}
