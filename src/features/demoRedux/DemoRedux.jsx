import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  getTodoListFetching,
  getTodosListData,
} from "./redux/demoReduxSlice";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { SpinnerLoading } from "../../components";

function DemoRedux() {
  const dispatch = useDispatch();
  const todos = useSelector(getTodosListData);
  const isFetching = useSelector(getTodoListFetching);
  const initialized = useRef(false);

  useEffect(() => {
    if (todos.length === 0 && !initialized.current) {
      initialized.current = true;
      dispatch(fetchTodos());
    }
  }, [dispatch, todos]);

  return (
    <>
      {isFetching ? (
       <SpinnerLoading />
      ) : (
        <div className="flex flex-wrap gap-5">
          {todos.map((todo) => (
            <div
              className=" w-64 h-44 bg-white shadow-md text-wrap p-3 rounded-lg relative"
              key={todo.id}
            >
              {todo.title}
              <span className="absolute bottom-2 right-2">
                {todo.completed ? (
                  <CheckIcon className="w-5 h-5 text-error" />
                ) : (
                  <XMarkIcon className="w-5 h-5 text-green-600" />
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default DemoRedux;
