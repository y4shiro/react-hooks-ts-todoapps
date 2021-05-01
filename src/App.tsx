import React, { useState } from "react";
import ReactDOM from "react-dom";

import {
  Button,
  Checkbox,
  Input,
  MenuItem,
  List,
  ListItem,
  Select,
  TextField,
} from "@material-ui/core";

interface Todo {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
}

type Filter = "all" | "checked" | "unchecked" | "removed";

const App: React.FC = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  // todos ステートを追加する関数
  const handleOnSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.FormEvent<HTMLInputElement>
      | React.FormEvent<HTMLButtonElement>
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

  // todos から removed フラグが true になっている todo を削除する
  const handleOnEmpty = () => {
    const newTodos = todos.filter((todo) => !todo.removed);
    setTodos(newTodos);
  };

  // フィルターの状態の応じて todos をフィルタリングして返す
  const filterdTodos = todos.filter((todo) => {
    switch (filter) {
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
    <>
      <Select
        defaultValue="all"
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <MenuItem value="all">全てのタスク</MenuItem>
        <MenuItem value="checked">完了したタスク</MenuItem>
        <MenuItem value="unchecked">未完了のタスク</MenuItem>
        <MenuItem value="removed">削除済みのタスク</MenuItem>
      </Select>
      {filter === "removed" ? (
        <Button
          disabled={todos.filter((todo) => todo.removed).length === 0}
          onClick={() => handleOnEmpty()}
        >
          ゴミ箱を空にする
        </Button>
      ) : (
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <TextField
            type="text"
            value={text}
            disabled={filter === "checked"}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            type="submit"
            color="primary"
            disabled={filter === "checked"}
            onSubmit={(e) => handleOnSubmit(e)}
          >
            追加
          </Button>
        </form>
      )}
      <List>
        {filterdTodos.map((todo) => (
          <ListItem key={todo.id}>
            <Checkbox
              disabled={todo.removed}
              checked={todo.checked}
              onChange={() => handleOnCheck(todo.id, todo.checked)}
            />
            <Input
              type="text"
              disabled={todo.checked || todo.removed}
              value={todo.value}
              onChange={(e) => handleOnEdit(todo.id, e.target.value)}
            />
            <Button onClick={() => handleOnRemove(todo.id, todo.removed)}>
              {todo.removed ? "復元" : "削除"}
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default App;
