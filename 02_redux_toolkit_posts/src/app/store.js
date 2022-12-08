import {configureStore} from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    // 스토어에 각 slice의 reducer 저장
    posts: postsReducer,
    users: usersReducer,
  },
});
