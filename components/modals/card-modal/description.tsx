"use client";

import { toast } from "sonner";
import { useState, useRef, ElementRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { AlignLeft } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";

interface DerscriptionProps {
    data: CardWithList;
};

export const Description = ({ data }:DerscriptionProps) => {
    const queryClient = useQueryClient();
    const params = useParams();

    const [isEditing, setIsEdiding] = useState(false);

    const textareaRef = useRef<ElementRef<"textarea">>(null);
    const formRef = useRef<ElementRef<"form">>(null);

    const enableEditing = () => {
        setIsEdiding(true);

        setTimeout(() => {
            textareaRef.current?.focus();
        });
    }

    const disableEditing = () => {
        setIsEdiding(false);
    }

    const onKeyDown = (e : KeyboardEvent) => {
        if(e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            });
            toast.success(`Карточка ${data.title} обновлена`);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onSubmit = (formData:FormData) => {
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;

        execute({id: data.id, description, boardId});
    }

    return (
        <div className="flex items-start gap-x-3 w-full ">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="f-semibold text-neutral-700  mb-2">
                    Описание
                </p>
                { isEditing ? (
                    <form 
                        action={onSubmit}
                        ref={formRef}
                        className="space-y-2"
                    >
                        <FormTextarea
                            ref={textareaRef}
                            id="description"
                            className="w-full mt-2 "
                            placeholder="Добавьте описание"
                            defaultValue={data.description || undefined}
                            errors={fieldErrors}
                        />
                        <div className="flex items-center gap-x-2">
                            <FormSubmit>
                                Сохранить
                            </FormSubmit>
                            <Button
                                type="button"
                                onClick={disableEditing}
                                size="sm"
                                variant="ghost"
                            >
                                Закрыть
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        role="button"
                        onClick={enableEditing}
                        className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                    >
                        {data.description || "Добавьте описание..."} 
                    </div>
                )}
            </div>
        </div>
    );
};

Description.Skeleton = function DescriptionSkeleton () {
    return(
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full ">
                <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
                <Skeleton className="h-[78px] w-full mb-2 bg-neutral-200" />
            </div>
        </div>
    )
}