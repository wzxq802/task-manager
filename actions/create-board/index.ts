"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";



const handler = async (data:InputType): Promise<ReturnType> => {
    const authResult = await auth(); // Разрешение промиса
    const { userId, orgId } = authResult;

    if(!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|");

    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing fields" };
    }

    let board;

    try{ 
        board = await db.board.create({
            data: { 
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName
            }
        });
    }catch{
        return {
            error: "Failed to create",
        };
    }

    revalidatePath(`/board/${board.id}`);
    return {data:board };
};

export const createBoard = createSafeAction(CreateBoard, handler);