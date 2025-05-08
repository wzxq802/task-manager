import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

// Правильное извлечение cardId
export async function GET(request: NextRequest) {
    try {
        const { userId, orgId } = await auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Получаем cardId из URL
        const url = new URL(request.url);
        const cardId = url.pathname.split("/").pop(); // Параметр cardId извлекаем из URL

        if (!cardId) {
            return new NextResponse("Card ID not found", { status: 400 });
        }

        const auditLogs = await db.auditLog.findMany({
            where: {
                orgId,
                entityId: cardId,
                entityType: ENTITY_TYPE.CARD,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 3,
        });

        return NextResponse.json(auditLogs);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
