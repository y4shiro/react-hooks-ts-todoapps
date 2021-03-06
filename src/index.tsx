import React, {
  useReducer,
  memo,
  Dispatch,
  createContext,
  useContext,
} from "react";
import ReactDOM from "react-dom";

interface Todo {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
}

type Filter = "all" | "checked" | "unchecked" | "removed";

interface State {
  text: string;
  todos: Todo[];
  filter: Filter;
}

const initialState: State = {
  text: "",
  todos: [],
  filter: "all",
};

type Action =
  | { type: "change"; value: string }
  | { type: "filter"; value: Filter }
  | { type: "submit" }
  | { type: "empty" }
  | { type: "edit"; id: number; value: string }
  | { type: "check"; id: number; checked: boolean }
  | { type: "remove"; id: number; removed: boolean };

const AppCotext = createContext(
  {} as {
    state: State;
    dispatch: Dispatch<Action>;
  }
);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "change": {
      return { ...state, text: action.value };
    }
    case "submit": {
      if (!state.text) return state;

      const newTodo: Todo = {
        value: state.text,
        id: new Date().getTime(),
        checked: false,
        removed: false,
      };

      return { ...state, todos: [newTodo, ...state.todos], text: "" };
    }
    case "filter":
      return { ...state, filter: action.value };
    case "edit": {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.id) {
          todo.value = action.value;
        }
        return todo;
      });
      return { ...state, todos: newTodos };
    }
    case "check": {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.id) {
          todo.checked = !action.checked;
        }
        return todo;
      });
      return { ...state, todos: newTodos };
    }
    case "remove": {
      const newTodos = state.todos.map((todo) => {
        if (todo.id === action.id) {
          todo.removed = !action.removed;
        }
        return todo;
      });
      return { ...state, todos: newTodos };
    }
    case "empty": {
      const newTodos = state.todos.filter((todo) => !todo.removed);
      return { ...state, todos: newTodos };
    }
    default:
      return state;
  }
};

const Selector: React.VFC = memo(() => {
  const { dispatch } = useContext(AppCotext);
  const handleOnFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "filter", value: e.target.value as Filter });
  };

  return (
    <select defaultValue="all" onChange={handleOnFilter}>
      <option value="all">??????????????????</option>
      <option value="checked">?????????????????????</option>
      <option value="unchecked">?????????????????????</option>
      <option value="removed">????????????????????????</option>
    </select>
  );
});
Selector.displayName = "Selector";

const EmptyButton: React.VFC = memo(() => {
  const { dispatch } = useContext(AppCotext);
  // todos ?????? removed ???????????? true ?????????????????? todo ???????????????
  const handleOnEmpty = () => {
    dispatch({ type: "empty" });
  };

  return <button onClick={() => handleOnEmpty()}>????????????????????????</button>;
});
EmptyButton.displayName = "EmptyButton";

const Form: React.VFC = memo(() => {
  const { state, dispatch } = useContext(AppCotext);
  // todos ?????????????????????????????????
  const handleOnSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    dispatch({ type: "submit" });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "change", value: e.target.value });
  };

  return (
    <form onSubmit={(e) => handleOnSubmit(e)}>
      <input
        type="text"
        value={state.text}
        disabled={state.filter === "checked"}
        onChange={handleOnChange}
      />
      <input
        type="submit"
        value="??????"
        disabled={state.filter === "checked"}
        onSubmit={(e) => handleOnSubmit(e)}
      />
    </form>
  );
});
Form.displayName = "Form";

const FilteredTodos: React.VFC = memo(() => {
  const { state, dispatch } = useContext(AppCotext);
  // ????????? todo ?????????????????????
  const handleOnEdit = (id: number, value: string) => {
    dispatch({ type: "edit", id, value });
  };

  // todo ?????????????????????????????????????????????????????? cheked ???????????????????????????
  const handleOnCheck = (id: number, checked: boolean) => {
    dispatch({ type: "check", id, checked });
  };

  // todo ????????????????????????????????????????????? removed ??? false ?????????????????????
  const handleOnRemove = (id: number, removed: boolean) => {
    dispatch({ type: "remove", id, removed });
  };

  // ???????????????????????????????????? todos ????????????????????????????????????
  const filterdTodos = state.todos.filter((todo) => {
    switch (state.filter) {
      case "all":
        return !todo.removed;
      case "checked":
        return todo.checked && !todo.removed;
      case "unchecked":
        return !todo.checked && !todo.removed;
      case "removed":
        return todo.removed;
      default:
        return todo;
    }
  });

  return (
    <ul>
      {filterdTodos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            disabled={todo.removed}
            checked={todo.checked}
            onChange={() => handleOnCheck(todo.id, todo.checked)}
          />
          <input
            type="text"
            disabled={todo.checked || todo.removed}
            value={todo.value}
            onChange={(e) => handleOnEdit(todo.id, e.target.value)}
          />
          <button onClick={() => handleOnRemove(todo.id, todo.removed)}>
            {todo.removed ? "??????" : "??????"}
          </button>
        </li>
      ))}
    </ul>
  );
});
FilteredTodos.displayName = "FilteredTodos";

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppCotext.Provider value={{ state, dispatch }}>
      <div>
        <Selector />
        {state.filter === "removed" ? <EmptyButton /> : <Form />}
        <FilteredTodos />
      </div>
    </AppCotext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
