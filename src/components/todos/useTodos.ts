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
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });
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
        body: JSON.stringify({ text }),
      });
    },
    onSuccess: (newTodo) => {
      queryClient.setQueryData(todosQuery.queryKey, (old) =>
        old ? { todos: [...old.todos, newTodo] } : undefined
      );
    },
  });

export const useToggleTodo = () =>
  useMutation({
    mutationFn: async ({ id }: Pick<Todo, "id">) => {
      tFetch(`/api/toggleTodo/${id}`, {
        method: "PUT",
      });

      queryClient.setQueryData(todosQuery.queryKey, (old) => {
        if (!old) return undefined;

        return {
          todos: old.todos.map((todo) =>
            todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo
          ),
        };
      });
    },
    onError: (error, { id }) => {
      queryClient.setQueryData(todosQuery.queryKey, (old) => {
        if (!old) return undefined;
        console.log("error", error);

        return {
          todos: old.todos.map((todo) =>
            todo.id === id ? { ...todo, isChecked: !todo.isChecked } : todo
          ),
        };
      });
    },
  }).mutate;
