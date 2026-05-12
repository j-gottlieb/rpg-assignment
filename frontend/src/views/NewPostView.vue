<template>
  <div class="new-post">
    <h1>New Post</h1>
    <form @submit.prevent="submit">
      <div class="field">
        <label>Title</label>
        <input v-model="title" type="text" required placeholder="Post title" />
      </div>
      <div class="field">
        <label>Content</label>
        <textarea v-model="content" required rows="10" placeholder="Write your post…" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="actions">
        <RouterLink to="/" class="cancel">Cancel</RouterLink>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Publishing…' : 'Publish' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const POSTS_QUERY = gql`
  query Posts {
    posts {
      id title content createdAt
      author { id username }
    }
  }
`

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
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

const router = useRouter()
const title = ref('')
const content = ref('')
const error = ref('')

const { mutate, loading } = useMutation(CREATE_POST, {
  // refetchQueries: [POSTS_QUERY],
  update(cache, { data }) {
    const newPost = data?.createPost
    if (!newPost) return
    const existing = cache.readQuery<{ posts: Post[] }>({ query: POSTS_QUERY })
    if (!existing) return
    cache.writeQuery({
      query: POSTS_QUERY,
      data: { posts: [newPost, ...existing.posts] },
    })
  },
})

async function submit() {
  error.value = ''
  try {
    await mutate({ input: { title: title.value, content: content.value } })
    router.push('/')
  } catch (e: unknown) {
    error.value = (e as Error).message ?? 'Failed to publish post'
  }
}
</script>

<style scoped>
.new-post {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}
h1 { font-size: 1.75rem; margin-bottom: 1.5rem; }
.field { display: flex; flex-direction: column; margin-bottom: 1rem; }
.field label { margin-bottom: 0.25rem; font-size: 0.875rem; }
.field input,
.field textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.cancel { color: #888; text-decoration: none; font-size: 0.9rem; }
button {
  padding: 0.5rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #e53e3e; font-size: 0.875rem; }
</style>
