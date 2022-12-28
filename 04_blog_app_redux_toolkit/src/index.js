import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {store} from "./app/store";
import {Provider} from "react-redux";
import {fetchPosts} from "./features/posts/postsSlice";
import {fetchUsers} from "./features/users/usersSlice";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// 애플리케이션이 시작되자마자 요청하기 위해서 index.js에서 요청한다.
store.dispatch(fetchUsers());
store.dispatch(fetchPosts());
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
