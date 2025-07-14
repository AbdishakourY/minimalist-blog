export type Post = {
  _id: string
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  createdAt?: string
  author: string
  readingTime: number
  tags: string[]
  published?: boolean
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  pagination?: {
    currentPage: number
    totalPages: number
    totalPosts: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Use environment variable or fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    console.log(`Making request to: ${url}`)
    console.log(`Request options:`, options)

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    console.log(`Response status: ${response.status}`)
    return response
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout - make sure the backend server is running")
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

async function getPosts(): Promise<ApiResponse<Post[]>> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/posts`)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    console.log("getPosts response:", data)
    return data
  } catch (error) {
    console.error("API Error in getPosts:", error)
    throw new Error("Failed to fetch posts. Make sure the backend server is running on the correct port.")
  }
}

async function getAllPosts(): Promise<ApiResponse<Post[]>> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/posts?includeUnpublished=true&limit=100`)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    console.log("getAllPosts response:", data)
    return data
  } catch (error) {
    console.error("API Error in getAllPosts:", error)
    throw new Error("Failed to fetch all posts. Make sure the backend server is running on the correct port.")
  }
}

async function getPost(slug: string): Promise<ApiResponse<Post>> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/posts/${slug}`)

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Post not found")
      }
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    console.log("getPost response:", data)
    return data
  } catch (error) {
    console.error("API Error in getPost:", error)
    if (error instanceof Error && error.message === "Post not found") {
      throw error
    }
    throw new Error("Failed to fetch post. Make sure the backend server is running on the correct port.")
  }
}

async function createPost(postData: Partial<Post>): Promise<ApiResponse<Post>> {
  try {
    console.log("Creating post with data:", postData)

    const res = await fetchWithTimeout(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    if (!res.ok) {
      let errorMessage = `HTTP error! status: ${res.status}`
      try {
        const errorData = await res.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage)
    }

    const data = await res.json()
    console.log("createPost response:", data)
    return data
  } catch (error) {
    console.error("API Error in createPost:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create post. Make sure the backend server is running on the correct port.")
  }
}

async function updatePost(slug: string, postData: Partial<Post>): Promise<ApiResponse<Post>> {
  try {
    console.log("Updating post with slug:", slug, "data:", postData)

    const res = await fetchWithTimeout(`${API_URL}/posts/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })

    if (!res.ok) {
      let errorMessage = `HTTP error! status: ${res.status}`
      try {
        const errorData = await res.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage)
    }

    const data = await res.json()
    console.log("updatePost response:", data)
    return data
  } catch (error) {
    console.error("API Error in updatePost:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to update post. Make sure the backend server is running on the correct port.")
  }
}

async function deletePost(slug: string): Promise<ApiResponse<void>> {
  try {
    console.log("Deleting post with slug:", slug)

    const res = await fetchWithTimeout(`${API_URL}/posts/${slug}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      let errorMessage = `HTTP error! status: ${res.status}`
      try {
        const errorData = await res.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage)
    }

    const data = await res.json()
    console.log("deletePost response:", data)
    return data
  } catch (error) {
    console.error("API Error in deletePost:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to delete post. Make sure the backend server is running on the correct port.")
  }
}

export const api = {
  getPosts,
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
}
