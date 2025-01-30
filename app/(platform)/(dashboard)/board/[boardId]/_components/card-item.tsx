"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

interface CardItemProps {
    index: number;
    data: Card;
}

export const CardItem = ({index, data}:CardItemProps) => {
    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role = "button"
                    className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md    shadow-sm"
                >
                    {data.title}
                </div>
            )}
        </Draggable>
    )
};