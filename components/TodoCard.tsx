"use client";

import getUrl from "@/libs/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd";

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    image: Image | string | undefined;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps | null | undefined;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};


export default function TodoCard({
    todo,
    index,
    id,
    image,
    innerRef,
    draggableProps,
    dragHandleProps,
}: Props) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const deleteTask = useBoardStore((state) => state.deleteTask);
    useEffect(() => {
        const fetchImage = async () => {
            if (typeof image === 'string') {
                // If image is a string (URL), set imageUrl directly
                setImageUrl(image);
            } else if (image) {
                // If image is an Image object, fetch the URL
                const url = await getUrl(image);
                if (url) {
                    setImageUrl(url.toString());
                }
            }
        };
    
        fetchImage();
    }, [image]);
    
    return (
        <div
            {...dragHandleProps}
            {...draggableProps}
            ref={innerRef}
            className="bg-white rounded-md space-y-2 drop-shadow-md"
        >
            <div className="flex justify-between items-center p-5">
                <p>{todo.title}</p>
                <button
                    onClick={() => {
                        deleteTask(index, todo, id);
                    }}
                    className="text-red-500 hover:text-red-600"
                >
                    <XCircleIcon className="ml-5 h-6 w-6" />
                </button>
            </div>
            {/* Add image here */}
            {(imageUrl) && (
                <div className="h-full w-full rounded-b-md">
                    <Image
                        src={imageUrl}
                        alt="Task Image"
                        width={400}
                        height={200}
                        className="w-full object-contain rounded-b-md"
                    />
                </div>
            )}
        </div>
    );
}
