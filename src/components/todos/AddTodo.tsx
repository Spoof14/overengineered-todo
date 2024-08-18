import { useRef, useCallback } from "react";
import { useAddTodo } from "./useTodos";

export const AddTodo = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useAddTodo();

  const onClick = useCallback(() => {
    if (!inputRef.current) return;

    mutate(inputRef.current.value);
    inputRef.current.value = "";
  }, [mutate]);

  return (
    <div>
      <input ref={inputRef} type="text" disabled={isPending} />
      <button onClick={onClick} disabled={isPending}>
        Add
      </button>
    </div>
  );
};
