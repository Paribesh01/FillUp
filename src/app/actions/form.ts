"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "../db";
import { type User } from "@clerk/nextjs/server";

// Utility to get current user or throw
async function requireUser(): Promise<User> {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");
    return user;
}

/**
 * Get all forms for the current user.
 */
export async function getUserForms() {
    try {
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
    } catch (error) {
        console.error("getUserForms error:", error);
        return { error: "Failed to fetch user forms." };
    }
}

/**
 * Create a new form for the current user.
 */
export async function createForm() {
    try {
        const user = await requireUser();
        const doc = await prisma.document.create({
            data: {
                title: "Untitled Form",
                content: {},
                userId: user.id,
            },
        });
        return doc;
    } catch (error) {
        console.error("createForm error:", error);
        return { error: "Failed to create form." };
    }
}

/**
 * Update the content of a form, only if it belongs to the current user.
 */
export async function updateFormContent(id: string, content: unknown) {
    try {
        const user = await requireUser();
        await prisma.document.update({
            where: { id, userId: user.id },
            data: { content: content as any },
        });
        return { success: true };
    } catch (error) {
        console.error("updateFormContent error:", error);
        return { error: "Failed to update form content." };
    }
}

/**
 * Update the title of a form, only if it belongs to the current user.
 */
export async function updateFormTitle(id: string, title: string) {
    try {
        const user = await requireUser();
        await prisma.document.update({
            where: { id, userId: user.id },
            data: { title },
        });
        return { success: true };
    } catch (error) {
        console.error("updateFormTitle error:", error);
        return { error: "Failed to update form title." };
    }
}

/**
 * Get all submissions for a document, filtered by current user.
 */
export async function getUserSubmissions(documentId: string) {
    try {
        const user = await currentUser();
        if (!user) return [];
        return await prisma.submission.findMany({
            where: { userId: user.id, documentId },
            include: { document: { select: { title: true } } },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("getUserSubmissions error:", error);
        return { error: "Failed to fetch submissions." };
    }
}

/**
 * Get a form by ID, only if it belongs to the current user.
 */
export async function getFormById(id: string) {
    try {
        const user = await requireUser();
        return await prisma.document.findUnique({
            where: { id, userId: user.id },
            select: { title: true, content: true, published: true },
        });
    } catch (error) {
        console.error("getFormById error:", error);
        return { error: "Failed to fetch form." };
    }
}

/**
 * Get all submissions for a form (no user filter).
 */
export async function getAllSubmissionsForForm(documentId: string) {
    try {
        return await prisma.submission.findMany({
            where: { documentId },
            include: { document: { select: { title: true } } },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("getAllSubmissionsForForm error:", error);
        return { error: "Failed to fetch submissions." };
    }
}

/**
 * Toggle the published state of a form.
 */
export async function togglePublish(docId: string, published: boolean) {
    try {
        // Optionally: check if the user owns the document
        // const user = await requireUser();
        // Could add: where: { id: docId, userId: user.id }
        const result = await prisma.document.update({
            where: { id: docId },
            data: { published },
        });
        return result;
    } catch (error) {
        console.error("togglePublish error:", error);
        return { error: "Failed to toggle publish state." };
    }
}

/**
 * Get a submission by its ID.
 */
export async function getSubmissionById(submissionId: string) {
    try {
        return await prisma.submission.findUnique({
            where: { id: submissionId },
        });
    } catch (error) {
        console.error("getSubmissionById error:", error);
        return { error: "Failed to fetch submission." };
    }
}

/**
 * Delete a form, only if it belongs to the current user.
 */
export async function deleteForm(id: string) {
    try {
        const user = await requireUser();
        await prisma.document.delete({
            where: { id, userId: user.id },
        });
        return { success: true };
    } catch (error) {
        console.error("deleteForm error:", error);
        return { error: "Failed to delete form." };
    }
}
