import { ReactNode } from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

// Тип с params как Promise
type Props = {
  children: ReactNode;
  params: Promise<{
    boardId: string;
  }>;
};

export default async function BoardIdLayout({ children, params }: Props) {
  const { boardId } = await params; // теперь корректно обрабатываем Promise

  try {
    const authData = await auth();
    const orgId = authData?.orgId;

    if (!orgId) {
      redirect("/select-org");
    }

    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return notFound();
    }

    return (
      <div
        className="relative h-full bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(${board.imageFullUrl})`,
        }}
      >
        <BoardNavbar data={board} />
        <div className="absolute inset-0 bg-black/10" />
        <main className="relative pt-28 h-full">
          {children}
        </main>
      </div>
    );
  } catch (err) {
    console.error("Error fetching board:", err);
    throw new Error("An unexpected error occurred while loading the board.");
  }
}
