import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-light text-gray-900 mb-4">Post not found</h1>
        <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
        <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
          ← Back to blog
        </Link>
      </div>
    </div>
  )
}
