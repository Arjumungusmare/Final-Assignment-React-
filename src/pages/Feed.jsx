import { useEffect, useRef, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export default function Feed() {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  // Focus textarea when the component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // GET: fetch tweets
  const {
    data: tweets = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["tweets"],
    queryFn: async () => {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tweets");
      }

      return response.json();
    },
  });

  // POST: create a tweet
  const createTweet = useMutation({
    mutationFn: async (tweetText) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: tweetText,
          author: "Guest",
          likes: 0,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tweet");
      }

      return response.json();
    },

    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
      textareaRef.current?.focus();
    },
  });

  // PUT: optimistic Like
  const likeTweet = useMutation({
    mutationFn: async (tweet) => {
      const updatedTweet = {
        ...tweet,
        likes: (tweet.likes || 0) + 1,
      };

      const response = await fetch(`${API_URL}/${tweet._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTweet),
      });

      if (!response.ok) {
        throw new Error("Failed to like tweet");
      }

      return response.json().catch(() => updatedTweet);
    },

    onMutate: async (tweet) => {
      await queryClient.cancelQueries({
        queryKey: ["tweets"],
      });

      const previousTweets = queryClient.getQueryData(["tweets"]);

      queryClient.setQueryData(["tweets"], (oldTweets = []) =>
        oldTweets.map((item) =>
          item._id === tweet._id
            ? { ...item, likes: (item.likes || 0) + 1 }
            : item
        )
      );

      // Intentional gap: previousTweets is saved,
      // but rollback on request failure is left for you.
      return { previousTweets };
    },

    // Refresh from the server after the request finishes.
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!text.trim() || createTweet.isPending) return;

    createTweet.mutate(text.trim());
  }

  if (isPending) {
    return <p>Loading tweets...</p>;
  }

  if (isError) {
    return (
      <p>
        Could not load tweets. Check your API URL and internet connection.
      </p>
    );
  }

  return (
    <section>
      <h1>Home Feed</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          rows={4}
          maxLength={280}
        />

        <p>{text.length}/280</p>

        <button
          type="submit"
          disabled={!text.trim() || createTweet.isPending}
        >
          {createTweet.isPending ? "Posting..." : "Post Tweet"}
        </button>

        {createTweet.isError && (
          <p>Tweet could not be posted. Please try again.</p>
        )}
      </form>

      <hr />

      <h2>Recent Tweets</h2>

      {tweets.length === 0 && <p>No tweets yet. Create one!</p>}

      {tweets.map((tweet) => (
        <article
          key={tweet._id}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <strong>{tweet.author}</strong>

          <p>{tweet.text}</p>

          <small>
            {tweet.createdAt
              ? new Date(tweet.createdAt).toLocaleString()
              : ""}
          </small>

          <div>
            <button
              onClick={() => likeTweet.mutate(tweet)}
              disabled={likeTweet.isPending}
            >
              ❤️ Like ({tweet.likes || 0})
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}