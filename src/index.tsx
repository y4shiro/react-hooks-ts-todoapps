import React, { useState } from "react";
import ReactDOM from "react-dom";

const App: React.FC = () => {
  const [text, setText] = useState("");

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="submit"
          value="追加"
          onChange={(e) => e.preventDefault()}
        />
      </form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
