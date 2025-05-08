import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

// Использование правильной синтаксиса для API маршрута
export async function GET(request: NextRequest, { params }: { params: { cardId: string } }) {
    try {
        const { userId, orgId } = await auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Получаем cardId из params
        const { cardId } = params; // Используем destructuring для извлечения cardId

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
    } catch  {
        return new NextResponse("Internal error", { status: 500 });
    }
}
