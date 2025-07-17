// import Link from "next/link"

// const posts = [
//   {
//     id: 1,
//     title: "The Art of Minimalism",
//     excerpt: "Exploring how less can truly be more in design and life.",
//     date: "2024-01-15",
//     slug: "art-of-minimalism",
//   },
//   {
//     id: 2,
//     title: "Digital Detox",
//     excerpt: "Why taking breaks from technology is essential for mental clarity.",
//     date: "2024-01-10",
//     slug: "digital-detox",
//   },
//   {
//     id: 3,
//     title: "Simple Living",
//     excerpt: "Finding joy in the everyday moments through intentional choices.",
//     date: "2024-01-05",
//     slug: "simple-living",
//   },
//   {
//     id: 4,
//     title: "Focus and Flow",
//     excerpt: "Creating environments that promote deep work and creativity.",
//     date: "2023-12-28",
//     slug: "focus-and-flow",
//   },
// ]

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-white">
//       <header className="border-b border-gray-100">
//         <div className="max-w-2xl mx-auto px-6 py-8">
//           <Link href="/" className="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors">
//             Blog
//           </Link>
//         </div>
//       </header>

//       <main className="max-w-2xl mx-auto px-6 py-12">
//         <div className="space-y-12">
//           {posts.map((post) => (
//             <article key={post.id} className="group">
//               <Link href={`/posts/${post.slug}`} className="block">
//                 <time className="text-sm text-gray-500 font-mono">
//                   {new Date(post.date).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </time>
//                 <h2 className="text-xl font-light text-gray-900 mt-2 group-hover:text-gray-600 transition-colors">
//                   {post.title}
//                 </h2>
//                 <p className="text-gray-600 mt-3 leading-relaxed">{post.excerpt}</p>
//               </Link>
//             </article>
//           ))}
//         </div>
//       </main>

//       <footer className="border-t border-gray-100 mt-24">
//         <div className="max-w-2xl mx-auto px-6 py-8">
//           <p className="text-sm text-gray-500">© 2024 Blog. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   )
// }

// app/page.tsx

import Link from "next/link"
import { api, Post } from "@/lib/api" // ✅ Import Post type

export default async function Home() {
  let posts: Post[] = [] // ✅ Explicitly typed

  try {
    const response = await api.getPosts()
    posts = response?.data || []
  } catch (error) {
    console.error("Error loading posts:", error)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link href="/" className="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors">
            Blog
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {posts.length > 0 ? (
          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post._id} className="group">
                <Link href={`/posts/${post.slug}`} className="block">
                  <time className="text-sm text-gray-500 font-mono">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="text-xl font-light text-gray-900 mt-2 group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mt-3 leading-relaxed">{post.excerpt}</p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No blog posts found.</p>
        )}
      </main>

      <footer className="border-t border-gray-100 mt-24">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-sm text-gray-500">© 2024 Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
