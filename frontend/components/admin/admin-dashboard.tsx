"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { api, type Post } from "@/lib/api"
import { PostEditor } from "./post-editor"
import { DeleteConfirmation } from "./delete-confirmation"

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletingPost, setDeletingPost] = useState<Post | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await api.getAllPosts() // We'll need to add this method
      setPosts(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = () => {
    setEditingPost(null)
    setShowEditor(true)
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setShowEditor(true)
  }

  const handleDeletePost = (post: Post) => {
    setDeletingPost(post)
  }

  const confirmDelete = async () => {
    if (!deletingPost) return

    try {
      await api.deletePost(deletingPost.slug)
      setPosts(posts.filter((p) => p._id !== deletingPost._id))
      setDeletingPost(null)
    } catch (err) {
      console.error("Error deleting post:", err)
      alert("Failed to delete post")
    }
  }

  const handleSavePost = async (postData: Partial<Post>) => {
    try {
      if (editingPost) {
        // Update existing post
        await api.updatePost(editingPost.slug, postData)
      } else {
        // Create new post
        await api.createPost(postData)
      }

      setShowEditor(false)
      setEditingPost(null)
      fetchPosts() // Refresh the list
    } catch (err) {
      console.error("Error saving post:", err)
      alert("Failed to save post")
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (showEditor) {
    return (
      <PostEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setShowEditor(false)
          setEditingPost(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "No posts found matching your search." : "No posts yet."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleCreatePost}
                    className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Create your first post
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                        <span>•</span>
                        <span>
                            {new Date(post.publishedAt ?? post.createdAt ?? "").toLocaleDateString()}
                        </span>
                        {post.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View post"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <DeleteConfirmation post={deletingPost} onConfirm={confirmDelete} onCancel={() => setDeletingPost(null)} />
      )}
    </div>
  )
}
