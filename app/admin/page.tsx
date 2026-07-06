import { AdminPanel } from "../../components/admin-panel"

export const metadata = {
  title: "Admin Panel - Techtics",
  description: "Techtics admin dashboard",
  robots: "noindex, nofollow", // Prevent indexing
}

export default function AdminPage() {
  return (
    <div className="w-full h-screen">
      <AdminPanel />
    </div>
  )
}
