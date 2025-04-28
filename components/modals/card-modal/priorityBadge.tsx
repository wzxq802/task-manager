"use client";
import {  useState } from "react";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; 

interface PriorityProps {
    data: CardWithList;
}

const priorityColors = {
    LOW: "bg-green-500",
    MEDIUM: "bg-yellow-500",
    HIGH: "bg-red-500",
};

export const PriorityBadge = ({ data }: PriorityProps) => {
    const queryClient = useQueryClient();
    const params = useParams();

    const { execute } = useAction(updateCard, {
        onSuccess: (data) => {
            toast.success(`Приоритет карточки обновлен`);
            queryClient.invalidateQueries({ queryKey: ["card", data.id] });
            queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const [priority, setPriority] = useState(data.priority);

    const onChange = (newPriority: "LOW" | "MEDIUM" | "HIGH") => {
        if (newPriority === priority) return;

        setPriority(newPriority);
        execute({ 
            priority: newPriority, 
            boardId: params.boardId as string, 
            id: data.id 
        });
    };

    return (
        <div className="flex items-center gap-2">
            <div
                className={cn("px-2 py-1 rounded text-white text-sm cursor-pointer", priorityColors[priority])}
            >
                {priority}
            </div>
            <select
                className="border rounded px-2 py-1 text-sm"
                value={priority}
                onChange={(e) => onChange(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
            >
                <option value="LOW">Низкий</option>
                <option value="MEDIUM">Средний</option>
                <option value="HIGH">Высокий</option>
            </select>
        </div>
    )
};

PriorityBadge.Skeleton = function PriorityBadgeSkeleton() {
    return (
        <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse" />
    );
};
