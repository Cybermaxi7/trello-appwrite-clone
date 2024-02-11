import { databases } from "@/appwrite";

export default async function getTodosGroupedByColumn() {
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!
    );
    const todos = data.documents;
    const columns = todos.reduce((acc, todo) => {
       if(!acc.get(todo.status)) {
        acc.set(todo.status, {
            id: todo.status,
            todos: [],
        })
       }
    
        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status, // Use the lowercase status when setting
            ...(todo.image && { image: JSON.parse(todo.image) }),
        });
    
        // console.log('Current todos for status:', acc.get(status)!.todos);
    
        return acc;
    }, new Map<TypedColumn, Column>());
    
    
    
    
    // if columns doesn't have inprogress, todo, or done, add them with empty todos

    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: [],
            });
        }
    }

    // Sort columns by columnType
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    );

    const board: Board = {
        columns: sortedColumns,
    };
    return board;
}
