// src/services/http.ts

let accessToken: string | null = null
let refreshToken: string | null = null

export function setTokens(tokens: { accessToken: string | null; refreshToken?: string | null }) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken ?? null
}

export function getAccessToken() {
  return accessToken
}

// let accessToken: string | null = null
// let refreshToken: string | null = null

// export function setTokens(tokens: { accessToken: string | null; refreshToken?: string | null }) {
//   accessToken = tokens.accessToken
//   refreshToken = tokens.refreshToken ?? null
// }

// export function getAccessToken() {
//   return accessToken
// }

async function rawRequest(path: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(`http://localhost:3000/${path}`, {
    ...options,
    credentials: "include", // puedes quitarlo si no usas cookies
  })
  return res
}

<<<<<<< HEAD
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  requireAuth = false,
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }
=======
export async function apiRequest<T>( path: string, options: RequestInit = {} ): Promise<T> {
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
>>>>>>> c3ed765d35e3bfbbb3944b3fdcfb05e6ac11bbce

  // normalize to a Headers instance so we can safely set values
  const headerObj = new Headers(headers)

<<<<<<< HEAD
  if (requireAuth && accessToken) {
    headerObj.set("Authorization", `Bearer ${accessToken}`)
  }
=======
  // if (requireAuth && accessToken) {
  //   headerObj.set("Authorization", `Bearer ${accessToken}`)
  // }
>>>>>>> c3ed765d35e3bfbbb3944b3fdcfb05e6ac11bbce

  const res = await rawRequest(path, { ...options, headers: headerObj })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed with status ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}
