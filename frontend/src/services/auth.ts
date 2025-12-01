// src/services/auth.ts
import { apiRequest, setTokens } from "./http"
const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000"

export type User = {
  id: string
  name: string
  email: string
  username: string // lo derivamos del email
}

type LoginResponse = {
  accessToken: string
  refreshToken?: string
  user: {
    id: string
    name: string
    email: string
  }
}

type SignupResponse = {
  id: string
  name: string
  email: string
}

let currentUser: User | null = null

export async function login(email: string, password: string): Promise<User> {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
  })

  const username = data.user.email.split("@")[0]

  currentUser = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    username,
  }

  return currentUser
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  const data = await apiRequest<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })

  // Opcion 1: volver al login
  // Opcion 2 (aquí): auto login
  return login(data.email, password)
}

export async function refresh(): Promise<void> {
  const data = await apiRequest<{ accessToken?: string }>("/auth/refresh-token", { method: "POST" })
  if (data?.accessToken) {
    setTokens({ accessToken: data.accessToken })
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>("/auth/logout", { method: "POST" }, true)
  } catch {
    // si falla igual limpiamos
  } finally {
    setTokens({ accessToken: null })
    currentUser = null
  }
}

export function getCurrentUser(): User | null {
  return currentUser
}

export function isAuthenticated(): boolean {
  // Considera autenticado si hay usuario o si existe un accessToken persistido
  return !!currentUser || !!localStorage.getItem('accessToken')
}

export function loginWithRoble(): void {
  // Redirige al flujo OAuth del backend
  window.location.href = `${BASE_URL}/auth/roble`
}
