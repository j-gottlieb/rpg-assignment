import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '../apollo'
import { gql } from '@apollo/client/core'

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user { id username email }
    }
  }
`

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user { id username email }
    }
  }
`

interface AuthUser {
  id: number
  username: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('user') ?? 'null'))

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(newToken: string, newUser: AuthUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    apolloClient.clearStore()
  }

  async function register(username: string, email: string, password: string) {
    const { data } = await apolloClient.mutate({
      mutation: REGISTER,
      variables: { input: { username, email, password } },
    })
    setAuth(data.register.token, data.register.user)
  }

  async function login(email: string, password: string) {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN,
      variables: { input: { email, password } },
    })
    setAuth(data.login.token, data.login.user)
  }

  return { token, user, isAuthenticated, register, login, clearAuth }
})
