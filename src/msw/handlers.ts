import { delay, http, HttpResponse } from "msw";
import { Todo } from "../types/Todo";

// const todos: Todo[] = [
//   { id: 1, text: "Buy milk" },
//   { id: 2, text: "Buy eggs" },
//   { id: 3, text: "Buy bread" },
// ];

const todos: Todo[] = [...new Array(1000)].map((_, i) => ({
  id: i + 1 + "",
  text: `Todo ${i + 1}`,
  isChecked: false,
}));

const throwOccasionalError = () => {
  if (Math.random() < 0.1) {
    throw new Error("Random error");
  }
};

export const handlers = [
  http.get("*/todos", async () => {
    await delay(1000);
    throwOccasionalError();
    return HttpResponse.json({ todos });
  }),

  http.post("*/addTodo", async ({ request }) => {
    await delay(1000);
    const newTodo = (await request.json()) as { text: string };
    todos.push({ id: String(todos.length + 1), text: newTodo.text });
    return HttpResponse.json(todos[todos.length - 1]);
  }),

  http.put("*/toggleTodo/:id", async ({ params }) => {
    await delay(200);
    const id = params.id;
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      return HttpResponse.error();
    }
    throwOccasionalError();
    todo.isChecked = !todo.isChecked;
    return HttpResponse.json(todo);
  }),
];
