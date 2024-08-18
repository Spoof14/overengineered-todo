import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Todo } from "../../types/Todo";
import { queryClient } from "../../main";

export const tFetch = async <T>(
  url: string,
  config?: RequestInit
): Promise<T> => {
  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`Error fetching ${url}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
};

const todosQuery = queryOptions({
  queryKey: ["todos"],
  queryFn: async () => tFetch<{ todos: Todo[] }>("/api/todos"),
});

export const useTodosSuspense = () => useSuspenseQuery(todosQuery).data.todos;

export const useAddTodo = () =>
  useMutation({
    mutationFn: async (text: string) => {
      return tFetch<Todo>("/api/addTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    },
    onSuccess: (newTodo) => {
      queryClient.setQueryData(todosQuery.queryKey, (old) =>
        old ? { todos: [...old.todos, newTodo] } : undefined
      );
    },
  });

export const useToggleCheck = () =>
  useMutation({
    mutationFn: async ({ id, isChecked }: Pick<Todo, "id" | "isChecked">) => {
      tFetch(`/api/checkTodo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isChecked }),
      });
      queryClient.setQueryData(todosQuery.queryKey, (old) => {
        if (!old) return undefined;
        console.log("hello?", old.todos.length, id);

        return {
          todos: old.todos.map((todo) =>
            todo.id === id ? { ...todo, isChecked } : todo
          ),
        };
      });
    },
  }).mutate;
