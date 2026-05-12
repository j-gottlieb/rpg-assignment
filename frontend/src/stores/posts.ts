import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  author: { id: number; username: string }
}

export const useSeenPosts = defineStore('posts', () => {
  const seenIds = ref<Set<number>>(new Set())

  const addSeenId = (id: number) => {
    seenIds.value.add(id)
  }

  return { seenIds, addSeenId }
})
