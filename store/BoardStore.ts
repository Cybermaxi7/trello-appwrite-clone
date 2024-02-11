import { ID, databases, storage } from "@/appwrite";
import getTodosGroupedByColumn from "@/libs/getTodosGroupedByColumn";
import uploadImage from "@/libs/uploadImage";
import { create } from "zustand";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    newTaskInput: string;
    setNewTaskInput: (input: string) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    newTaskType: TypedColumn;
    setNewTaskType: (columnId: TypedColumn) => void;
    image: File | null;
    setImage: (image: File | null) => void;
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    searchString: "",
    newTaskInput: "",
    newTaskType: "todo",
    image: null,
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
    setSearchString: (searchString) => set({ searchString }),
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },
    setBoardState: (board) => set({ board }),
    setImage: (image: File | null) => set({ image }),
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        );
    },
    // setImage: (image: File | null) =>
    //     set((state) => ({
    //         ...state,
    //         image,
    //     })),
    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.columns);

        // delete todoId from columns
        newColumns.get(id)?.todos.splice(taskIndex, 1);
        set({ board: { columns: newColumns } });

        //delete image
        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }
        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
            todo.$id
        );
    },
    addTask: async (
        todo: string,
        columnId: TypedColumn,
        image?: File | null
    ) => {
        let file: Image | undefined;
        if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                };
            }
        }
        console.log(file);
        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                // include image if exist
                ...(file && { Image: JSON.stringify(file) }),
            }
        );
        set({ newTaskInput: "" });
        set((state) => {
            const newColumns = new Map(state.board.columns);
            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                // Include image if it exist
                ...(file && { image: file }),
            };
            const column = newColumns.get(columnId);
            if (!column) {
                newColumns.set(columnId, { id: columnId, todos: [newTodo] });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }
            return {
                board: {
                    columns: newColumns,
                },
            };
        });
    },
}));
