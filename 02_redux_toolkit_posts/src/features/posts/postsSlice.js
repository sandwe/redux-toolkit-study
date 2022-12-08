import {createSlice, nanoid} from "@reduxjs/toolkit";
import {sub} from "date-fns";

const initialState = [
  {
    id: nanoid(),
    title: "Learning Redux Toolkit",
    content: "I've heard good things.",
    date: sub(new Date(), {minutes: 10}).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
  {
    id: nanoid(),
    title: "Slices...",
    content: "The more I say slice, the more I want pizza.",
    date: sub(new Date(), {minutes: 5}).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      // 액션이 발생하고 payload를 커스텀해야 하는 경우 { reducer, prepare } 두개의 프로퍼티로 나누어 작성할 수 있다.
      // reducer 값은 reducer 함수여야 하고, prepare 값은 prepare 콜백 함수여야 한다.
      reducer(state, action) {
        // createSlice는 immer를 사용하여 mutable하게 상태 변경을 작성하면 내부적으로 immutable하게 상태를 변경한다.
        state.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action) {
      const {postId, reaction} = action.payload;
      const existingPost = state.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

export const selectAllPosts = (state) => state.posts;
// 리듀서를 밖에서도 사용할 수 있도록 꺼낸다.
export const {postAdded, reactionAdded} = postsSlice.actions;
export default postsSlice.reducer;
