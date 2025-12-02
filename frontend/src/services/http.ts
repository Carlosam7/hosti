// src/services/http.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"

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
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // puedes quitarlo si no usas cookies
  })
  return res
}


export async function apiRequest<T>( path: string, options: RequestInit = {} ): Promise<T> {
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // normalize to a Headers instance so we can safely set values
  const headerObj = new Headers(headers)

  // if (requireAuth && accessToken) {
  //   headerObj.set("Authorization", `Bearer ${accessToken}`)
  // }

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
