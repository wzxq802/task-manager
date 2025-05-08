import { ReactNode } from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

// Определим тип Props с параметрами динамической страницы
type Props = {
  children: ReactNode;
  params: {
    boardId: string;
  };
};

// Основной компонент
export default async function BoardIdLayout({ children, params }: Props) {
  const { boardId } = params; // получаем идентификатор доски

  try {
    const authData = await auth(); // выполняем авторизацию
    const orgId = authData?.orgId; // получаем идентификатор организации

    if (!orgId) {
      redirect("/select-org"); // переадресовываемся, если нет выбранной организации
    }

    // проверяем существование доски
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return notFound(); // возвращаем 404 страницу, если доска не найдена
    }

    // рендерим разметку страницы
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
    console.error("Error fetching board:", err); // регистрируем ошибку
    throw new Error("An unexpected error occurred while loading the board."); // выбрасываем исключение
  }
}