"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";



const handler = async (data:InputType): Promise<ReturnType> => {
    const authResult = await auth(); // Разрешение промиса
    const { userId } = authResult;

    if(!userId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title } = data;

    let board;

    try{ 
        board = await db.board.create({
            data: { 
                title,
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