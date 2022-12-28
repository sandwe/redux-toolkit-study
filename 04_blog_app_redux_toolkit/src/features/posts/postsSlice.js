import {createSlice, nanoid, createAsyncThunk} from "@reduxjs/toolkit";
import {sub} from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// createAsyncThunk() : 비동기 요청
export const fetchPosts = createAsyncThunk("posts/fetechPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (err) {
    return err.message;
  }
});

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost) => {
  try {
    const response = await axios.post(POSTS_URL, initialPost);
    //리턴 값이 action의 payload가 된다.
    return response.data;
  } catch (err) {
    return err.message;
  }
});

export const updatePost = createAsyncThunk("posts/updatePost", async (initialPost) => {
  const {id} = initialPost;
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
    return response.data;
  } catch (err) {
    // return err.message;
    return initialPost; // only for testing redux!
  }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (initialPost) => {
  const {id} = initialPost;
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    // 보통의 rest api에서는 삭제된 post id가 전달될 것이다.
    // jsonplaceholder는 delete시 빈 객체를 반환한다.
    // 따라서 삭제한 게시글을 리턴하도록 한다.
    if (response?.status === 200) return initialPost;
    return `${response?.status}: ${response?.statusText}`;
  } catch (err) {
    return err.message;
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      // 액션이 발생하고 payload를 커스텀해야 하는 경우 { reducer, prepare } 두개의 프로퍼티로 나누어 작성할 수 있다.
      // reducer 값은 reducer 함수여야 하고, prepare 값은 prepare 콜백 함수여야 한다.
      reducer(state, action) {
        // createSlice는 immer를 사용하여 mutable하게 상태 변경을 작성하면 내부적으로 immutable하게 상태를 변경한다.
        state.posts.push(action.payload);
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
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  // 프로미스의 상태에 따라 state의 status 변경
  // builder 객체는 addCase, addMatcher, addDefaultCase 메서드를 제공해 어떤 액션을 reducer가 처리할지를 정의한다.
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      //fetchPosts가 fulfiled이면 state값을 action.payload를 이용해 수정
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // date, reactions 추가
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), {minutes: min++}).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });

        // loadedPost를 전역 상태에 추가
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error(action.error.message);
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        const {id} = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const {id} = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
      });
  },
});

// selectors
export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const selectPostById = (state, postId) => state.posts.posts.find((post) => post.id === postId);
// 리듀서를 밖에서도 사용할 수 있도록 꺼낸다.
export const {postAdded, reactionAdded} = postsSlice.actions;
export default postsSlice.reducer;
