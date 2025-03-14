import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux"; // Import Provider
import { store } from "./app/store"; // Import the store you created
import App from "./App"; // Import your main App component

ReactDOM.render(
  <Provider store={store}> {/* Wrap the app with Provider */}
    <App />
  </Provider>,
  document.getElementById("root")
);
