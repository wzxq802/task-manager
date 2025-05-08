import { ReactNode } from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

// Определяем тип для входящего props
type Props = {
  children: ReactNode;
  params: {
    boardId: string;
  };
};

// Компонент
export default async function BoardIdLayout({ children, params }: Props) {
  try {
    const authData = await auth(); // Получаем аутентификационные данные
    const orgId = authData?.orgId; // Извлекаем идентификатор организации

    if (!orgId) {
      redirect("/select-org"); // Перенаправляем пользователя, если организация не выбрана
    }

    // Проверяем существование доски
    const board = await db.board.findUnique({
      where: {
        id: params.boardId, // Используем переданный boardId
        orgId,
      },
    });

    if (!board) {
      notFound(); // Возвращаем страницу "не найдено", если доска отсутствует
    }

    // Рендерим главную разметку страницы
    return (
      <div
        className="relative h-full bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(${board.imageFullUrl})`,
        }}
      >
        <BoardNavbar data={board} /> {/* Навигационная панель */}
        <div className="absolute inset-0 bg-black/10" />
        <main className="relative pt-28 h-full">
          {children} {/* Содержимое дочерних элементов */}
        </main>
      </div>
    );
  } catch (err) {
    console.error("Error fetching board:", err);
    throw new Error("An unexpected error occurred while loading the board.");
  }
}