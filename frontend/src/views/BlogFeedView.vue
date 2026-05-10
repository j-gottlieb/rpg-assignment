<template>
  <div class="feed">
    <div class="feed-header">
      <h1>Blog Feed</h1>
      <RouterLink to="/posts/new" class="new-post-btn">+ New Post</RouterLink>
    </div>

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="error" class="state error">Failed to load posts.</div>
    <div v-else-if="!posts.length" class="state">No posts yet. Be the first!</div>

    <article
      v-for="post in posts"
      :key="post.id"
      class="post-card"
      :class="{ 'post-card--new': newPostIds.has(post.id) }"
    >
      <div class="post-meta">
        <span class="author">{{ post.author.username }}</span>
        <span class="date">{{ formatDate(post.createdAt) }}</span>
      </div>
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useQuery, useSubscription } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { computed, ref } from 'vue'

const POSTS_QUERY = gql`
  query Posts {
    posts {
      id
      title
      content
      createdAt
      author { id username }
    }
  }
`

const POST_CREATED_SUBSCRIPTION = gql`
  subscription PostCreated {
    postCreated {
      id
      title
      content
      createdAt
      author { id username }
    }
  }
`

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  author: { id: number; username: string }
}

const { result, loading, error } = useQuery(POSTS_QUERY)
const posts = ref<Post[]>([])
const newPostIds = ref<Set<number>>(new Set())

// Populate posts once query loads
const queryPosts = computed(() => result.value?.posts ?? [])
import { watch } from 'vue'
watch(queryPosts, (val) => { posts.value = val }, { immediate: true })

useSubscription(POST_CREATED_SUBSCRIPTION, undefined, {
  fetchPolicy: 'no-cache',
}).onResult(({ data }) => {
  if (!data?.postCreated) return
  const newPost: Post = data.postCreated

  // Avoid duplicates (own posts already added optimistically by apollo)
  if (posts.value.some((p) => p.id === newPost.id)) return

  posts.value = [newPost, ...posts.value]
  newPostIds.value = new Set([...newPostIds.value, newPost.id])

  setTimeout(() => {
    newPostIds.value = new Set([...newPostIds.value].filter((id) => id !== newPost.id))
  }, 3000)
})

function formatDate(iso: string) {
  const formatOptions = Intl.DateTimeFormat().resolvedOptions()
  return new Date(iso).toLocaleString(formatOptions.locale, { timeZone: formatOptions.timeZone })
}
</script>

<style scoped>
.feed {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
h1 { font-size: 1.75rem; }
.new-post-btn {
  padding: 0.4rem 1rem;
  background: #42b883;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
}
.state {
  text-align: center;
  padding: 3rem 0;
  color: #888;
}
.state.error { color: #e53e3e; }
.post-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  background-color: transparent;
  transition: background-color 3s ease;
}
.post-card--new {
  background-color: #f0fdf4;
  border-color: #42b883;
  transition: none;
}
.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
}
.author { font-weight: 600; color: #42b883; }
h2 { font-size: 1.2rem; margin-bottom: 0.5rem; }
p { line-height: 1.6; white-space: pre-wrap; }
</style>
