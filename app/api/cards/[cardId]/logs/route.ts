import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

// Убедись, что передаешь параметры как обычный объект
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }  // Здесь явно указываем тип параметров
): Promise<NextResponse> {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { cardId } = params; // cardId - это просто параметр маршрута

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
    console.error("Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
