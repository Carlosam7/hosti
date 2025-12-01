// src/services/auth.ts
import React from "react"
import { apiRequest } from "./http"

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
  // Placeholder to avoid TS error
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
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
  return loginTwo(data.email, password)
}
export async function loginTwo(email: string, password: string ): Promise<User> {
  console.log("Login two called with:", email, password);
  const data = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })
  const result = await data.json()
  console.log("Login two OK:", result)
  return result
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>("/auth/logout", { method: "POST" })
  } catch {
    // si falla igual limpiamos
  } finally {
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

