import React, { useState } from "react";
import ReactDOM from "react-dom";

interface Todo {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
}

const App: React.FC = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // todos ステートを追加する関数
  const handleOnSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    // 何も入力値がなければ早期リターン
    if (!text) return;

    // 新しい Todo を作成
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    // newTodo を追加したのち、スプレッド構文で todos へ値を展開する
    setTodos([newTodo, ...todos]);
    // フォームへの入力をクリアする
    setText("");
  };

  // 既存の todo を編集する関数
  const handleOnEdit = (id: number, value: string) => {
    // todos から編集したい todo を id で検索し、マッチした場合に value を書き換える
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.value = value;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  // todo のチェックボックスをクリックした時に cheked の値を反転する関数
  const handleOnCheck = (id: number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  // todo の削除ボタンをクリックした時に removed を false に変更する関数
  const handleOnRemove = (id: number, removed: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  return (
    <div>
      <form onSubmit={(e) => handleOnSubmit(e)}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input type="submit" value="追加" onClick={(e) => handleOnSubmit(e)} />
      </form>
      <ul>
        {todos.map((todo) => (
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
