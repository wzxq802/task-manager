"use client";

import { useAction } from "@/hooks/use-action";
import { useParams } from "next/navigation";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { toast } from "sonner";
import { useCardModal } from "@/hooks/use-card-modal";

interface ActionsProps {
    data: CardWithList;
}

export const Actions = ({data}:ActionsProps) => {
    const params = useParams();

    const cardModal = useCardModal();

    const { execute: executeCopyCard, isLoading: isLoadingCopy} = useAction(copyCard, {
        onSuccess: (data) => {
            toast.success(`Card ${data.title} copied`);
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeDeleteCard, isLoading: isLoadingDelete} = useAction(deleteCard, {
        onSuccess: (data) => {
            toast.success(`Карточка ${data.title} удалена`);
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onCopy = () => {
        const boardId = params.boardId as string;

        executeCopyCard({
            id: data.id,
            boardId,
        });
    };
    const onDelete = () => {
        const boardId = params.boardId as string;

        executeDeleteCard({
            id: data.id,
            boardId,
        });
    };
    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">
                Опции
            </p>
            <Button
                onClick={onCopy}
                disabled={isLoadingCopy}
                variant="gray"
                className="w-full justify-start"
                size="inline"
            >
                <Copy className="w-4 h-4 mr-2 text-neutral-700" />
                Копировать
            </Button>
            <Button
                onClick={onDelete}
                disabled={isLoadingDelete}
                variant="gray"
                className="w-full justify-start"
                size="inline"
            >
                <Trash className="w-4 h-4 mr-2 text-neutral-700" />
                Удалить
            </Button>
        </div>
    )
};

Actions.Skeleton = function ActionsSkeleton () {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
            <Skeleton className="w-full h-8 bg-neutral-200"/>
        </div>
    )
}