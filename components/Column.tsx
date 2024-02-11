import { useBoardStore } from "@/store/BoardStore";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useModalStore } from "@/store/ModalStore";
// import { todo } from "node:test";

type Props = {
    id: TypedColumn;
    todos: Todo[];
    index: number;
};

const idToColumnText: { [key in TypedColumn]: string } = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
};

export default function Column({ id, todos, index }: Props) {
    const [searchString, setNewTaskType] = useBoardStore((state) => [
        state.searchString,
        state.setNewTaskType,
    ]);
    const openModal = useModalStore((state) => state.openModal);
    function handleAddTodo() {
        setNewTaskType(id);
        openModal();
    }
    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {/* render droppable todos in the column */}
                    <Droppable droppableId={index.toString()} type="card">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`p-2 rounded-2xl shadow-sm ${
                                    snapshot.isDraggingOver
                                        ? "bg-green-200"
                                        : "bg-white/50"
                                }`}
                            >
                                <h2 className="flex justify-between items-center font-bold p-2 text-lg">
                                    {idToColumnText[id]}
                                    <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-2 text-sm font-normal">
                                        {!searchString
                                            ? todos.length
                                            : todos.filter((todo) =>
                                                  todo.title
                                                      .toLowerCase()
                                                      .includes(
                                                          searchString.toLowerCase()
                                                      )
                                              ).length}
                                    </span>
                                </h2>

                                <div className="space-y-2">
                                    {todos.map((todo, index) => {
                                        if (
                                            searchString &&
                                            !todo.title
                                                .toLowerCase()
                                                .includes(
                                                    searchString.toLowerCase()
                                                )
                                        )
                                            return null;
                                        return (
                                            <Draggable
                                                draggableId={todo.$id}
                                                index={index}
                                                key={todo.$id}
                                            >
                                                {(provided) => (
                                                    <TodoCard
                                                        todo={todo}
                                                        index={index}
                                                        image={todo?.image}
                                                        id={id}
                                                        innerRef={
                                                            provided.innerRef
                                                        }
                                                        draggableProps={
                                                            provided.draggableProps
                                                        }
                                                        dragHandleProps={
                                                            provided.dragHandleProps
                                                        }
                                                    />
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                    <div className="flex items-end">
                                        <button
                                            onClick={handleAddTodo}
                                            className="textgreen500 text-green-600"
                                        >
                                            <PlusCircleIcon className="h-8 w-8" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
}
