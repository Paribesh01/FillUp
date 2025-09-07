"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "../db";

export async function getUserForms() {
    const user = await currentUser();
    if (!user) return [];
    return await prisma.document.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            published: true,
            content: true,

        },
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

export async function updateFormContent(id: string, content: unknown) {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");
    // Optionally: check if the document belongs to the user
    await prisma.document.update({
        where: { id, userId: user.id },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { content: content as any },
    });
}

export async function updateFormTitle(id: string, title: string) {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");
    await prisma.document.update({
        where: { id, userId: user.id },
        data: { title },
    });
}

export async function getUserSubmissions(documentId: string) {
    const user = await currentUser();
    if (!user) return [];
    return await prisma.submission.findMany({
        where: { userId: user.id, documentId: documentId },
        include: { document: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
    });
}

export async function getFormById(id: string) {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");
    return await prisma.document.findUnique({
        where: { id, userId: user.id },
        select: { title: true, content: true, published: true },
    });
}

export async function getAllSubmissionsForForm(documentId: string) {
    // No user filter: get all submissions for this form
    return await prisma.submission.findMany({
        where: { documentId },
        include: { document: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
    });
}

export async function togglePublish(docId: string, published: boolean) {
    console.log("togglePublish", docId, published);
    const result = await prisma.document.update({
        where: { id: docId },
        data: { published },
    });
    console.log("result", result);
    return result;
}

export async function getSubmissionById(submissionId: string) {
    return await prisma.submission.findUnique({
        where: { id: submissionId },
    });
}
