import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET (
    req: Request,
    { params } : { params: { cardId: string }}
){
    try{
        const authData = await auth();
        const orgId = authData.orgId;
        const userId = authData.userId;

        if (!userId || !orgId) {
            return new NextResponse("Unautorized", { status: 401 });
        }

        const card = await db.card.findUnique({
            where: {
                id: params.cardId,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
            include: {
                list:{
                    select: {
                        title: true,
                    },
                },
            },
        });
        return NextResponse.json(card);
    }catch {
        return new NextResponse("Internal Error", { status: 500 });
    }
}