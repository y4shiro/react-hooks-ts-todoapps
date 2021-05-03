import React, { useReducer, memo, Dispatch } from "react";
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

const Selector: React.VFC<{ dispatch: Dispatch<Action> }> = memo(
  ({ dispatch }) => {
    const handleOnFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: "filter", value: e.target.value as Filter });
    };

    return (
      <select defaultValue="all" onChange={handleOnFilter}>
        <option value="all">全てのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">未完了のタスク</option>
        <option value="removed">削除済みのタスク</option>
      </select>
    );
  }
);
Selector.displayName = "Selector";

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "change", value: e.target.value });
  };

  // todos ステートを追加する関数
  const handleOnSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    dispatch({ type: "submit" });
  };

  // 既存の todo を編集する関数
  const handleOnEdit = (id: number, value: string) => {
    dispatch({ type: "edit", id, value });
  };

  // todo のチェックボックスをクリックした時に cheked の値を反転する関数
  const handleOnCheck = (id: number, checked: boolean) => {
    dispatch({ type: "check", id, checked });
  };

  // todo の削除ボタンをクリックした時に removed を false に変更する関数
  const handleOnRemove = (id: number, removed: boolean) => {
    dispatch({ type: "remove", id, removed });
  };

  // todos から removed フラグが true になっている todo を削除する
  const handleOnEmpty = () => {
    dispatch({ type: "empty" });
  };

  // フィルターの状態の応じて todos をフィルタリングして返す
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
    <div>
      <Selector dispatch={dispatch} />
      {state.filter === "removed" ? (
        <button
          disabled={state.todos.filter((todo) => todo.removed).length === 0}
          onClick={() => handleOnEmpty()}
        >
          ゴミ箱を空にする
        </button>
      ) : (
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <input
            type="text"
            value={state.text}
            disabled={state.filter === "checked"}
            onChange={handleOnChange}
          />
          <input
            type="submit"
            value="追加"
            disabled={state.filter === "checked"}
            onSubmit={(e) => handleOnSubmit(e)}
          />
        </form>
      )}
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
              {todo.removed ? "復元" : "削除"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
