import React from "react";
import ReactDOM from "react-dom";

const App: React.FC = () => {
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" value={""} onChange={(e) => e.preventDefault()} />
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
