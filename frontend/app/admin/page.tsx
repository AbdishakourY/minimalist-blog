// import { redirect } from "next/navigation"
// import { AdminDashboard } from "@/components/admin/admin-dashboard"

// // Simple password protection (in production, use proper authentication)
// export default async function AdminPage({
//   searchParams,
// }: {
//   searchParams: { password?: string }
// }) {
//   // Await the searchParams before using
//   const params = await searchParams

//   const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

//   if (params.password !== adminPassword) {
//     redirect("/admin/login")
//   }

//   return <AdminDashboard />
// }
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage({ searchParams }: { searchParams: { password?: string } }) {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  if (searchParams.password !== adminPassword) {
    redirect("/admin/login")
  }

  return <AdminDashboard />
}
