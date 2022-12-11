import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {store} from "./app/store";
import {Provider} from "react-redux";
import {fetchUsers} from "./features/users/usersSlice";

// 애플리케이션이 시작되자마자 요청하기 위해서 index.js에서 요청한다.
store.dispatch(fetchUsers());
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
