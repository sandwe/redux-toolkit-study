// api 통신과 관련된 메소드 작성
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // reducer 함수를 스토어에 등록할 때 사용할 root state key
  baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3500"}), // endpoint의 baseurl을 설정한다.
  tagTypes: ["Todos"], // 캐시에 태그를 달아 어떤 mutation이 캐시를 무효화시켜 자동으로 데이터를 refetch하도록 한다.
  endpoints: (builder) => ({
    getTodos: builder.query({
      // api 통신하는 메소드 정의
      query: () => "/todos", // baseurl에 /todos가 추가된다.
      transformResponse: (res) => res.sort((a, b) => b.id - a.id),
      providesTags: ["Todos"],
    }),
    // 단지 데이터 요청하는 것이 아니라 데이터를 바꾸는 경우 mutation 사용
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ["Todos"], // 무효화 시킬 태그명을 나열 -> 변경됨을 알려주어 새 데이터를 다시 받아올 수 있게 한다.
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation({
      query: ({id}) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

// 아래와 같이 메소드 이름을 커스텀해서 컴포넌트 내에서 사용할 수 있다.
export const {useGetTodosQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation} = apiSlice;
