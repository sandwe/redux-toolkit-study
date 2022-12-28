import {useSelector} from "react-redux";
import {selectAllPosts, getPostsStatus, getPostsError} from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {
  const posts = useSelector(selectAllPosts); // 상태가 변경되면 slice 내의 selectAllPosts가 상태 변경을 감지할 수 있다.
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  // 통신 상태에 따라 다른 컴포넌트 렌더링
  let content;
  if (postsStatus === "loading") {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === "succeeded") {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => <PostsExcerpt key={post.id} post={post} />);
  } else if (postsStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};

export default PostsList;
