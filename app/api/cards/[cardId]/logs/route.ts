import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

// Типизация для Next.js 13 с новым API
export async function GET(request: NextRequest, context: { params: { cardId: string } }) {
    try {
        const { userId, orgId } = await auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { cardId } = context.params; // извлекаем cardId из context.params

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
