'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Users, 
  Settings, 
  Upload,
  Plus,
  TrendingUp 
} from 'lucide-react'

interface DashboardStats {
  totalRetainers: number
  activeRetainers: number
  totalClients: number
  totalTemplates: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRetainers: 0,
    activeRetainers: 0,
    totalClients: 0,
    totalTemplates: 0,
  })
  const [recentRetainers, setRecentRetainers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [retainersRes, clientsRes, templatesRes] = await Promise.all([
          fetch('/api/retainers'),
          fetch('/api/clients'),
          fetch('/api/templates'),
        ])

        if (retainersRes.ok && clientsRes.ok && templatesRes.ok) {
          const retainers = await retainersRes.json()
          const clients = await clientsRes.json()
          const templates = await templatesRes.json()

          setStats({
            totalRetainers: retainers.length,
            activeRetainers: retainers.filter((r: any) => r.status === 'ACTIVE').length,
            totalClients: clients.length,
            totalTemplates: templates.length,
          })

          // Show recent retainers (limit to 5)
          setRecentRetainers(retainers.slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your retainer agreements and client relationships
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Retainers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRetainers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Retainers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeRetainers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/retainers/new">
          <Button className="w-full h-24 flex flex-col items-center justify-center space-y-2">
            <Plus className="h-6 w-6" />
            <span>New Retainer</span>
          </Button>
        </Link>
        <Link href="/dashboard/clients/new">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
            <Users className="h-6 w-6" />
            <span>Add Client</span>
          </Button>
        </Link>
        <Link href="/dashboard/templates/new">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
            <Settings className="h-6 w-6" />
            <span>Create Template</span>
          </Button>
        </Link>
        <Link href="/dashboard/upload">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center space-y-2">
            <Upload className="h-6 w-6" />
            <span>Upload Documents</span>
          </Button>
        </Link>
      </div>

      {/* Recent Retainers */}
      {recentRetainers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Retainers</CardTitle>
            <CardDescription>Your most recently created retainer agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRetainers.map((retainer: any) => (
                <div key={retainer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{retainer.client.name}</h4>
                    <p className="text-sm text-gray-600">
                      {retainer.client.companyName && `${retainer.client.companyName} • `}
                      ${retainer.retainerFee.toLocaleString()} • {retainer.status}
                    </p>
                  </div>
                  <Link href={`/dashboard/retainers/${retainer.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
            {recentRetainers.length >= 5 && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/retainers">
                  <Button variant="outline">View All Retainers</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Getting Started */}
      {stats.totalRetainers === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Welcome! Here's how to create your first retainer agreement:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">1</div>
                <div>
                  <h4 className="font-medium">Add a Client</h4>
                  <p className="text-sm text-gray-600">Start by adding your client's information</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">2</div>
                <div>
                  <h4 className="font-medium">Create a Template</h4>
                  <p className="text-sm text-gray-600">Set up your retainer agreement template</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">3</div>
                <div>
                  <h4 className="font-medium">Generate Retainer</h4>
                  <p className="text-sm text-gray-600">Create and export your retainer agreement</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/dashboard/clients/new">
                <Button>Get Started</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}