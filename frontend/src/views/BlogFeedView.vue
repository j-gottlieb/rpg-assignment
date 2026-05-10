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
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { computed, ref, watch } from 'vue'

const POSTS_QUERY = gql`
  query Posts {
    posts {
      id title content createdAt
      author { id username }
    }
  }
`

const POST_CREATED_SUBSCRIPTION = gql`
  subscription PostCreated {
    postCreated {
      id title content createdAt
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

const { result, loading, error, subscribeToMore } = useQuery(POSTS_QUERY)
const posts = computed<Post[]>(() => result.value?.posts ?? [])

const newPostIds = ref<Set<number>>(new Set())
const seenIds = ref<Set<number>>(new Set())

watch(posts, (current, previous) => {
  // If seenIds is empty this is the first real data load — mark all as seen, no highlight
  if (seenIds.value.size === 0 || !previous || previous.length === 0) {
    current.forEach((p) => seenIds.value.add(p.id))
    return
  }
  // Any post not yet seen arrived via subscription — highlight it
  current.forEach((p) => {
    if (!seenIds.value.has(p.id)) {
      seenIds.value.add(p.id)
      newPostIds.value = new Set([...newPostIds.value, p.id])
      setTimeout(() => {
        newPostIds.value = new Set([...newPostIds.value].filter((id) => id !== p.id))
      }, 3000)
    }
  })
}, { immediate: true })

// subscribeToMore writes directly into the Apollo cache so posts
// persist across navigation without a separate local ref
subscribeToMore({
  document: POST_CREATED_SUBSCRIPTION,
  updateQuery: (prev, { subscriptionData }) => {
    const newPost = subscriptionData?.data?.postCreated
    if (!newPost) return prev
    if (prev.posts.some((p: Post) => p.id === newPost.id)) return prev
    return { posts: [newPost, ...prev.posts] }
  },
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
