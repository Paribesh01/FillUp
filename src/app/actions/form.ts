
"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "../db";

export async function getUserForms() {
    const user = await currentUser();
    if (!user) return [];
    return await prisma.document.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });
}

export async function createForm() {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");
    const doc = await prisma.document.create({
        data: {
            title: "Untitled Form",
            content: {},
            userId: user.id,
        },
    });
    return doc;
}

export async function updateFormContent(id: string, content: any) {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");
    // Optionally: check if the document belongs to the user
    await prisma.document.update({
        where: { id, userId: user.id },
        data: { content },
    });
}
