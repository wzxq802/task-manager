"use client";

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
};

function reorder<T>(list:T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    const { execute: executeUpdateListOrder} = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("Порядок списков изменен");
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const { execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Порядок карточек изменен");
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result:DropResult) => {
        const { source, destination, type } = result;

        if(!destination) {
            return;
        }

        //If dropped in the same posotion
        if(destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        //If user moves a list
        if (type === "list") {
            const items = reorder(
                orderedData, 
                source.index, 
                destination.index
            ).map((item, index)=> ({...item, order:index}));

            setOrderedData(items);
            executeUpdateListOrder({items, boardId});
        }

        //If user moves a card
        if(type === "card") {
            const newOrderedData = [...orderedData];

            //Source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);

            if(!sourceList || !destList) {
                return;
            }

            //Check if cards exists on the sourceList
            if(!sourceList.cards) {
                sourceList.cards = [];
            }

            //Check if cards exists on the destList
            if(!destList.cards) {
                destList.cards = [];
            }

            //Moving a card in the same list
            if(source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

                reorderedCards.forEach((card, index) => {
                    card.order = index;
                });

                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({
                    boardId: boardId, 
                    items: reorderedCards 
                });
                //User movers a card to ahother list
            }else {
                // remove a card from source list
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                //Assing a new listId to the moved card
                movedCard.listId = destination.droppableId;

                //Add the card to the destination list
                destList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, index) => {
                    card.order = index;
                });

                //Update the order
                destList.cards.forEach((card, index) => {
                    card.order = index;
                });

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({
                    boardId: boardId, 
                    items: destList.cards,
                });
            }
        }
    }

    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, index ) => {
                            return (
                                <ListItem
                                    key = {list.id}
                                    index = {index}
                                    data = {list}
                                />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm/>
                        <div className="flex-shrink-0 w-1"/>
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
};