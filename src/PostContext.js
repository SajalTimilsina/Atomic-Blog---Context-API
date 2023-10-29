import { createContext, useContext, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

// 1. Create a new context
const PostContext = createContext(); // this is a component thats why it has uppercase

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  ); // Only runs in initial render because of call back

  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

// using custom hooks to get the data
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContent was used outside the PostProvider");
  return context;
}
export { PostProvider, usePosts }; // provider and a hooks to read out the value from provider
