'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Users, 
  Settings, 
  Upload, 
  LogOut,
  Home 
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/')
        }
      } catch (error) {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Retainer Generator</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user.name}</p>
          </div>
          <nav className="mt-6">
            <div className="px-6 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/retainers"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Retainers</span>
              </Link>
              <Link
                href="/dashboard/clients"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Clients</span>
              </Link>
              <Link
                href="/dashboard/templates"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Templates</span>
              </Link>
              <Link
                href="/dashboard/upload"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Documents</span>
              </Link>
            </div>
          </nav>
          <div className="absolute bottom-6 left-6 right-6">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}