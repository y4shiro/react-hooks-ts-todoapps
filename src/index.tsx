import React, { useState } from "react";
import ReactDOM from "react-dom";

interface Todo {
  value: string;
}

const App: React.FC = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // todos ステートを更新する関数
  const handleOnSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    // 何も入力値がなければ早期リターン
    if (!text) return;

    // 新しい Todo を作成
    const newTodo: Todo = {
      value: text,
    };

    // newTodo を追加したのち、スプレッド構文で todos へ値を展開する
    setTodos([newTodo, ...todos]);
    // フォームへの入力をクリアする
    setText("");
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
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
