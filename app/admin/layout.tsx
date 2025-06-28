import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Kullanıcı giriş kontrolü ve rol kontrolü
  const user = await currentUser()

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user) {
    redirect('/sign-in')
  }

  // Admin rolü kontrolü
  const userRole = user.publicMetadata?.role
  console.log('Admin Layout - User:', user.emailAddresses[0]?.emailAddress, 'Role:', userRole)

  if (userRole !== 'admin') {
    console.log('Access denied - redirecting to home')
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
