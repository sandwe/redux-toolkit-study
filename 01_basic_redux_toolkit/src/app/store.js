import {configureStore} from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    // 스토어에 각 slice의 reducer 저장
    counter: counterReducer,
  },
});
