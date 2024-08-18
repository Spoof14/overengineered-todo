import {
  ChangeEvent,
  InputHTMLAttributes,
  memo,
  useCallback,
  useRef,
} from "react";
import { useTodosSuspense, useToggleCheck } from "./useTodos";
import { Todo } from "../../types/Todo";
import { AddTodo } from "./AddTodo";

export const Todos = () => {
  const todos = useTodosSuspense();
  const toggleTodo = useToggleCheck();
  const timeoutIdsRef = useRef(new Map<string, NodeJS.Timeout>());

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { id, checked: isChecked } = e.target;
      let timeoutIdRef = timeoutIdsRef.current.get(id);
      if (timeoutIdRef) clearTimeout(timeoutIdRef);

      timeoutIdRef = setTimeout(() => {
        toggleTodo({ id, isChecked });
      }, 1000);
      timeoutIdsRef.current.set(id, timeoutIdRef);
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
          checked={todo.isChecked}
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
