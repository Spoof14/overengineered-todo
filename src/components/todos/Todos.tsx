import {
  ChangeEvent,
  InputHTMLAttributes,
  memo,
  useCallback,
  useRef,
} from "react";
import { useTodosSuspense, useToggleTodo } from "./useTodos";
import { Todo } from "../../types/Todo";
import { AddTodo } from "./AddTodo";

export const Todos = () => {
  const todos = useTodosSuspense();
  const toggleTodo = useToggleTodo();
  const timeoutIdsRef = useRef(new Map<string, NodeJS.Timeout>());

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { id } = e.target;
      let timeoutId = timeoutIdsRef.current.get(id);
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        toggleTodo({ id });
      }, 500);
      timeoutIdsRef.current.set(id, timeoutId);
    },
    [toggleTodo]
  );

  return (
    <div>
      <h1>Todos</h1>
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          {...todo}
          name={todo.id}
          onChange={onChange}
        />
      ))}
      <AddTodo />
    </div>
  );
};

const TodoListItem = memo(
  (props: InputHTMLAttributes<HTMLInputElement> & Todo) => {
    const { text, isChecked, ...inputProps } = props;

    return (
      <div>
        <label>
          <input type="checkbox" defaultChecked={isChecked} {...inputProps} />
          {text}
        </label>
      </div>
    );
  }
);
