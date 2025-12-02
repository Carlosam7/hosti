// src/services/auth.ts

export type User = {
  id: string
  name: string
  email: string
  username: string
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

// Login - POST /auth/login
export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const result = await response.json();
  
  const username = result.user.email.split("@")[0];
  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    username,
  };
}

// Signup - POST /auth/signup
export async function signup(name: string, email: string, password: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  const result = await response.json();
  
  const username = result.user.email.split("@")[0];
  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    username,
  };
}

// Verificar sesión - GET /auth/me
export async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (!result.valid || !result.user) {
      return null;
    }

    const username = result.user.email?.split("@")[0] || "user";
    
    return {
      id: result.user.sub,
      name: result.user.email, // El backend solo devuelve sub, email, role
      email: result.user.email,
      username,
    };
  } catch {
    return null;
  }
}

// Logout - POST /auth/logout
export async function logout(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Refresh token - POST /auth/refresh
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}
