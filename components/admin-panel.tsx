/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  BarChart3,
  Mail,
  Settings,
  Users,
  FileText,
  DollarSign,
  LogOut,
  Menu,
  X,
  Loader2,
  Trash2,
  Plus,
  Upload,
  Send,
  Eye,
  Download,
  ArrowLeft,
  Home,
  Shield,
  ChevronRight,
  Bell,
  User,
  ExternalLink,
} from "lucide-react"

type Tab = "dashboard" | "services" | "pricing" | "contacts" | "email" | "bulk" | "settings"

interface Service {
  id: number
  name: string
  description: string
}

interface PricingItem {
  id: number
  name: string
  price: number
  currency: string
}

interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  category: string
}

interface BulkEmailTemplate {
  _id?: string
  name: string
  subject: string
  body: string
  description?: string
}

interface BulkEmailContact {
  _id: string
  businessName: string
  email: string
  city: string
  state: string
  category: string
  status: "pending" | "sent" | "failed" | "bounced"
  batchId: string
  sentAt?: string
  errorMessage?: string
}

interface BatchInfo {
  _id: string
  count: number
  pending: number
  sent: number
  failed: number
  createdAt: string
}

const API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "default-admin-key"

// Tab labels for breadcrumbs
const TAB_LABELS: Record<Tab, string> = {
  dashboard: "Dashboard",
  services: "Services",
  pricing: "Pricing",
  contacts: "Contacts",
  email: "Email Templates",
  bulk: "Bulk Email",
  settings: "Settings",
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [loginError, setLoginError] = useState("")

  // Check for existing session on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken")
    if (sessionToken) {
      // Session exists, validate it (simple time-based check)
      const tokenTime = parseInt(sessionToken)
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000
      if (now - tokenTime < oneDay) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem("sessionToken")
      }
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    const storedPassword = localStorage.getItem("adminPassword")
    const currentPassword = storedPassword || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
    
    if (passwordInput === currentPassword) {
      setIsAuthenticated(true)
      setPasswordInput("")
      localStorage.setItem("sessionToken", Date.now().toString())
    } else {
      setLoginError("Invalid password. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPasswordInput("")
    localStorage.removeItem("sessionToken")
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginForm 
        onSubmit={handleLogin} 
        passwordInput={passwordInput} 
        setPasswordInput={setPasswordInput}
        error={loginError}
      />
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeTab={activeTab}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {activeTab === "dashboard" && <DashboardTab onTabChange={setActiveTab} />}
            {activeTab === "services" && <ServicesTab />}
            {activeTab === "pricing" && <PricingTab />}
            {activeTab === "contacts" && <ContactsTab />}
            {activeTab === "email" && <EmailTab />}
            {activeTab === "bulk" && <BulkEmailTab />}
            {activeTab === "settings" && <SettingsTab onLogout={handleLogout} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function AdminLoginForm({
  onSubmit,
  passwordInput,
  setPasswordInput,
  error,
}: {
  onSubmit: (e: React.FormEvent) => void
  passwordInput: string
  setPasswordInput: (value: string) => void
  error?: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Back to site header */}
      <header className="p-4 md:p-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Website</span>
        </Link>
      </header>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-white/60">Techtics Management System</p>
          </div>

          <Card className="border-0 shadow-2xl shadow-black/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Welcome Back</CardTitle>
              <CardDescription>Enter your password to continue</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={onSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium block mb-2 text-gray-700">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-center text-gray-500">
                  Protected area. Unauthorized access is prohibited.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-white/60 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <Home className="h-3 w-3" />
              Visit Main Website
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-white/40 text-xs">
          &copy; {new Date().getFullYear()} Techtics. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
}: {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onLogout: () => void
}) {
  const menuItems: Array<{ id: Tab; label: string; icon: React.ReactNode; description?: string }> = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-5 w-5" />, description: "Overview & stats" },
    { id: "services", label: "Services", icon: <FileText className="h-5 w-5" />, description: "Manage services" },
    { id: "pricing", label: "Pricing", icon: <DollarSign className="h-5 w-5" />, description: "Pricing plans" },
    { id: "contacts", label: "Contacts", icon: <Users className="h-5 w-5" />, description: "Customer inquiries" },
    { id: "email", label: "Email Templates", icon: <Mail className="h-5 w-5" />, description: "Email management" },
    { id: "bulk", label: "Bulk Email", icon: <Upload className="h-5 w-5" />, description: "Mass email campaigns" },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, description: "Configuration" },
  ]

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-72 h-screen bg-slate-900 text-white flex flex-col transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Techtics</h1>
              <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={activeTab === item.id ? "text-white" : "text-white/50"}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink className="h-5 w-5 text-white/50" />
            <span className="font-medium text-sm">View Website</span>
          </Link>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  )
}

function TopBar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  onLogout,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeTab: Tab
  onLogout: () => void
}) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <span className="text-gray-400">Admin</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <span className="font-medium text-gray-900">{TAB_LABELS[activeTab]}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Visit site button - desktop only */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Site</span>
        </Link>

        {/* User menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <button
            onClick={onLogout}
            className="hidden sm:block text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}

// Page Header Component for consistent styling
function PageHeader({ 
  title, 
  description, 
  action 
}: { 
  title: string
  description: string
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

function DashboardTab({ onTabChange }: { onTabChange?: (tab: Tab) => void } = {}) {
  const [stats, setStats] = useState({ services: 0, pricing: 0, contacts: 0, templates: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, pricingRes] = await Promise.all([
          fetch("/api/admin/manage?type=services", {
            headers: { "x-admin-key": API_KEY },
          }),
          fetch("/api/admin/manage?type=pricing", {
            headers: { "x-admin-key": API_KEY },
          }),
        ])

        if (!servicesRes.ok || !pricingRes.ok) {
          throw new Error(`API error: ${servicesRes.status} ${pricingRes.status}`)
        }

        const services = await servicesRes.json()
        const pricing = await pricingRes.json()

        setStats({
          services: services.length,
          pricing: pricing.length,
          contacts: 12,
          templates: 3,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your site."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCard title="Total Services" value="..." description="Loading" icon={<FileText className="h-5 w-5" />} />
            <StatCard title="Pricing Plans" value="..." description="Loading" icon={<DollarSign className="h-5 w-5" />} />
            <StatCard title="Recent Contacts" value="..." description="Loading" icon={<Users className="h-5 w-5" />} />
            <StatCard title="Email Templates" value="..." description="Loading" icon={<Mail className="h-5 w-5" />} />
          </>
        ) : (
          <>
            <StatCard title="Total Services" value={stats.services.toString()} description="Active services" icon={<FileText className="h-5 w-5" />} color="blue" />
            <StatCard title="Pricing Plans" value={stats.pricing.toString()} description="Available plans" icon={<DollarSign className="h-5 w-5" />} color="green" />
            <StatCard title="Recent Contacts" value={stats.contacts.toString()} description="This month" icon={<Users className="h-5 w-5" />} color="purple" />
            <StatCard title="Email Templates" value={stats.templates.toString()} description="Configured" icon={<Mail className="h-5 w-5" />} color="orange" />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            onClick={() => onTabChange?.("services")}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
          >
            <FileText className="h-5 w-5" />
            <span>Edit Services</span>
          </Button>
          <Button 
            onClick={() => onTabChange?.("pricing")}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
          >
            <DollarSign className="h-5 w-5" />
            <span>Update Pricing</span>
          </Button>
          <Button 
            onClick={() => onTabChange?.("contacts")}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
          >
            <Users className="h-5 w-5" />
            <span>View Contacts</span>
          </Button>
          <Button 
            onClick={() => onTabChange?.("bulk")}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700"
          >
            <Upload className="h-5 w-5" />
            <span>Bulk Email</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Getting Started</CardTitle>
          <CardDescription>Tips for managing your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Services</p>
                <p className="text-sm text-gray-600">Add, edit, or remove services displayed on your website.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Campaigns</p>
                <p className="text-sm text-gray-600">Use Bulk Email to import contacts and send outreach campaigns.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Settings className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Security Settings</p>
                <p className="text-sm text-gray-600">Update your admin password in Settings to keep your panel secure.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ServicesTab() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [newService, setNewService] = useState({ name: "", description: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/manage?type=services", {
        headers: { "x-admin-key": API_KEY },
      })
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async () => {
    if (!newService.name || !newService.description) {
      alert("Please fill in all fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/admin/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": API_KEY,
        },
        body: JSON.stringify({
          action: "add",
          type: "service",
          data: newService,
        }),
      })

      if (response.ok) {
        const newServiceData = await response.json()
        setServices([...services, newServiceData])
        setNewService({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Failed to add service:", error)
      alert("Failed to add service")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const response = await fetch("/api/admin/manage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": API_KEY,
        },
        body: JSON.stringify({ type: "service", id }),
      })

      if (response.ok) {
        setServices(services.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete service:", error)
      alert("Failed to delete service")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Services" 
        description="Manage your offered services"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Service Name</label>
              <Input
                placeholder="e.g., Web Development"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Description</label>
              <Input
                placeholder="Brief description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddService} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Existing Services</CardTitle>
          <CardDescription>{services.length} services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No services yet. Add your first one above.</p>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PricingTab() {
  const [pricing, setPricing] = useState<PricingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newPricing, setNewPricing] = useState({ name: "", price: "", currency: "USD" })
  const [editingPricing, setEditingPricing] = useState<PricingItem | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/manage?type=pricing", {
        headers: { "x-admin-key": API_KEY },
      })
      const data = await response.json()
      setPricing(data)
    } catch (error) {
      console.error("Failed to fetch pricing:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPricing = async () => {
    if (!newPricing.name || !newPricing.price) {
      alert("Please fill in all fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/admin/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": API_KEY,
        },
        body: JSON.stringify({
          action: "add",
          type: "pricing",
          data: {
            name: newPricing.name,
            price: parseInt(newPricing.price),
            currency: newPricing.currency,
          },
        }),
      })

      if (response.ok) {
        const newPricingData = await response.json()
        setPricing([...pricing, newPricingData])
        setNewPricing({ name: "", price: "", currency: "USD" })
      }
    } catch (error) {
      console.error("Failed to add pricing:", error)
      alert("Failed to add pricing")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePricing = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pricing?")) return

    try {
      const response = await fetch("/api/admin/manage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": API_KEY,
        },
        body: JSON.stringify({ type: "pricing", id }),
      })

      if (response.ok) {
        setPricing(pricing.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete pricing:", error)
      alert("Failed to delete pricing")
    }
  }

  const handleUpdatePricing = async () => {
    if (!editingPricing || !editingPricing.name || !editingPricing.price) {
      alert("Please fill in all fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/admin/manage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": API_KEY,
        },
        body: JSON.stringify({
          type: "pricing",
          id: editingPricing.id,
          data: {
            name: editingPricing.name,
            price: typeof editingPricing.price === "string" ? parseInt(editingPricing.price) : editingPricing.price,
            currency: editingPricing.currency,
          },
        }),
      })

      if (response.ok) {
        setPricing(pricing.map((p) => (p.id === editingPricing.id ? editingPricing : p)))
        setEditingPricing(null)
      }
    } catch (error) {
      console.error("Failed to update pricing:", error)
      alert("Failed to update pricing")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pricing" 
        description="Manage your service pricing plans"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Service Name</label>
              <Input
                placeholder="Service name"
                value={newPricing.name}
                onChange={(e) => setNewPricing({ ...newPricing, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Price</label>
              <Input
                placeholder="Price"
                type="number"
                value={newPricing.price}
                onChange={(e) => setNewPricing({ ...newPricing, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Currency</label>
              <Input
                placeholder="Currency"
                value={newPricing.currency}
                onChange={(e) => setNewPricing({ ...newPricing, currency: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddPricing} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Pricing
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Pricing</CardTitle>
          <CardDescription>{pricing.length} pricing plans</CardDescription>
        </CardHeader>
        <CardContent>
          {editingPricing && (
            <div className="p-4 border-2 border-blue-200 rounded-lg space-y-4 bg-blue-50 mb-6">
              <h3 className="font-semibold text-blue-900">Edit: {editingPricing.name}</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  value={editingPricing.name}
                  onChange={(e) => setEditingPricing({ ...editingPricing, name: e.target.value })}
                />
                <Input
                  type="number"
                  value={editingPricing.price}
                  onChange={(e) => setEditingPricing({ ...editingPricing, price: parseInt(e.target.value) || 0 })}
                />
                <Input
                  value={editingPricing.currency}
                  onChange={(e) => setEditingPricing({ ...editingPricing, currency: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdatePricing} disabled={submitting} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button onClick={() => setEditingPricing(null)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : pricing.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pricing plans yet. Add your first one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        {item.currency} {item.price.toLocaleString()}
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPricing(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePricing(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ContactsTab() {
  const [contacts] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      subject: "Project Inquiry",
      date: "2025-12-23",
      status: "new" as const,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Website Development",
      date: "2025-12-22",
      status: "replied" as const,
    },
  ])

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contacts" 
        description="View and manage customer inquiries"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Contacts</CardTitle>
          <CardDescription>{contacts.length} total submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{contact.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{contact.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{contact.subject}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{contact.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === "new"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EmailTab() {
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    fromEmail: "mohan0512vittal@gmail.comm",
    replyEmail: "mohan0512vittal@gmail.comm",
  })

  const contactConfirmationHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Thank You</title></head><body><h1>Thank you for contacting us!</h1><p>We will get back to you soon.</p></body></html>`
  const welcomeEmailHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Welcome</title></head><body><h1>Welcome to Techtics!</h1><p>We're excited to have you.</p></body></html>`
  const projectProposalHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Proposal</title></head><body><h1>Your Project Proposal</h1><p>Here are the details...</p></body></html>`

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    { id: 1, name: "Contact Confirmation", subject: "Thank you for contacting us", body: contactConfirmationHTML, category: "Contact" },
    { id: 2, name: "Welcome Email", subject: "Welcome to Techtics", body: welcomeEmailHTML, category: "Welcome" },
    { id: 3, name: "Project Proposal", subject: "Your Project Proposal", body: projectProposalHTML, category: "Proposal" },
  ])

  const [showAddTemplate, setShowAddTemplate] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [showSendEmail, setShowSendEmail] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Omit<EmailTemplate, "id">>({
    name: "",
    subject: "",
    body: "",
    category: "",
  })

  const [sendEmailForm, setSendEmailForm] = useState({
    toEmail: "",
    toName: "",
    selectedTemplate: "",
    customSubject: "",
    customBody: "",
  })

  const [loading, setLoading] = useState(false)

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      alert("Please fill all fields")
      return
    }
    const template: EmailTemplate = {
      id: Math.max(...templates.map((t) => t.id), 0) + 1,
      ...newTemplate,
    }
    setTemplates([...templates, template])
    setNewTemplate({ name: "", subject: "", body: "", category: "" })
    setShowAddTemplate(false)
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return
    setTemplates(templates.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)))
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (id: number) => {
    if (confirm("Delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  const handleSendEmail = async () => {
    if (!sendEmailForm.toEmail || !sendEmailForm.toName) {
      alert("Please enter recipient details")
      return
    }
    setLoading(true)
    try {
      const selectedTemplate = templates.find((t) => t.id === Number(sendEmailForm.selectedTemplate))
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          toEmail: sendEmailForm.toEmail,
          toName: sendEmailForm.toName,
          subject: sendEmailForm.customSubject || selectedTemplate?.subject || "Message from Techtics",
          body: sendEmailForm.customBody || selectedTemplate?.body || "",
        }),
      })
      if (response.ok) {
        alert("Email sent!")
        setSendEmailForm({ toEmail: "", toName: "", selectedTemplate: "", customSubject: "", customBody: "" })
        setShowSendEmail(false)
      } else {
        alert("Failed to send email")
      }
    } catch (error) {
      alert("Error: " + String(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Email Templates" 
        description="Manage email templates and send direct emails"
        action={
          <Button onClick={() => setShowAddTemplate(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SMTP Settings</CardTitle>
          <CardDescription>Configure your email server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">SMTP Host</label>
              <Input value={emailConfig.smtpHost} onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">SMTP Port</label>
              <Input value={emailConfig.smtpPort} onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">From Email</label>
              <Input value={emailConfig.fromEmail} onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Reply Email</label>
              <Input value={emailConfig.replyEmail} onChange={(e) => setEmailConfig({ ...emailConfig, replyEmail: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Email */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Send Email</CardTitle>
            <CardDescription>Send a direct email using templates</CardDescription>
          </div>
          <Button onClick={() => setShowSendEmail(!showSendEmail)} variant="outline">
            {showSendEmail ? "Hide" : "Compose"}
          </Button>
        </CardHeader>
        {showSendEmail && (
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Recipient email" value={sendEmailForm.toEmail} onChange={(e) => setSendEmailForm({ ...sendEmailForm, toEmail: e.target.value })} />
              <Input placeholder="Recipient name" value={sendEmailForm.toName} onChange={(e) => setSendEmailForm({ ...sendEmailForm, toName: e.target.value })} />
            </div>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={sendEmailForm.selectedTemplate}
              onChange={(e) => {
                setSendEmailForm({ ...sendEmailForm, selectedTemplate: e.target.value })
                const t = templates.find((t) => t.id === Number(e.target.value))
                if (t) setSendEmailForm((prev) => ({ ...prev, customSubject: t.subject, customBody: t.body }))
              }}
            >
              <option value="">-- Select template --</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <Input placeholder="Subject" value={sendEmailForm.customSubject} onChange={(e) => setSendEmailForm({ ...sendEmailForm, customSubject: e.target.value })} />
            <Textarea rows={6} placeholder="Body" value={sendEmailForm.customBody} onChange={(e) => setSendEmailForm({ ...sendEmailForm, customBody: e.target.value })} />
            <Button onClick={handleSendEmail} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
              Send Email
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Templates</CardTitle>
          <CardDescription>{templates.length} templates available</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddTemplate && (
            <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg space-y-4 bg-blue-50">
              <h3 className="font-semibold">New Template</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Template name" value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} />
                <Input placeholder="Category" value={newTemplate.category} onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })} />
              </div>
              <Input placeholder="Subject" value={newTemplate.subject} onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })} />
              <Textarea rows={6} placeholder="Body (HTML)" value={newTemplate.body} onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })} />
              <div className="flex gap-2">
                <Button onClick={handleAddTemplate} className="bg-blue-600 hover:bg-blue-700">Save</Button>
                <Button onClick={() => setShowAddTemplate(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          )}

          {editingTemplate && (
            <div className="p-4 border-2 border-amber-300 rounded-lg space-y-4 bg-amber-50">
              <h3 className="font-semibold">Edit: {editingTemplate.name}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input value={editingTemplate.name} onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })} />
                <Input value={editingTemplate.category} onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })} />
              </div>
              <Input value={editingTemplate.subject} onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} />
              <Textarea rows={6} value={editingTemplate.body} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })} />
              <div className="flex gap-2">
                <Button onClick={handleUpdateTemplate} className="bg-blue-600 hover:bg-blue-700">Save</Button>
                <Button onClick={() => setEditingTemplate(null)} variant="outline">Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{template.category}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Subject: {template.subject}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template.id)} className="text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Default business outreach template
const DEFAULT_OUTREACH_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Opportunity</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #145da0 0%, #0c2d48 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { font-size: 24px; margin-bottom: 10px; }
    .content { padding: 40px 30px; color: #333; }
    .greeting { font-size: 18px; margin-bottom: 20px; }
    .message { font-size: 15px; line-height: 1.8; margin-bottom: 25px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #145da0 0%, #0c2d48 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .footer { background: #f8f9fa; padding: 30px; text-align: center; font-size: 13px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Digital Growth for {{businessName}}</h1>
    </div>
    <div class="content">
      <p class="greeting">Hello {{businessName}} Team,</p>
      <p class="message">We noticed your business in {{city}}, {{state}} and wanted to reach out about how we can help you grow your digital presence in the {{category}} industry.</p>
      <center><a href="https://techtics.com" class="cta-button">Schedule Free Consultation</a></center>
    </div>
    <div class="footer">Techtics | mohan0512vittal@gmail.com</div>
  </div>
</body>
</html>`

function BulkEmailTab() {
  const [batches, setBatches] = useState<BatchInfo[]>([])
  const [templates, setTemplates] = useState<BulkEmailTemplate[]>([])
  const [contacts, setContacts] = useState<BulkEmailContact[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const [csvText, setCsvText] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<BulkEmailTemplate | null>(null)
  const [newTemplate, setNewTemplate] = useState<Omit<BulkEmailTemplate, "_id">>({
    name: "",
    subject: "",
    body: DEFAULT_OUTREACH_TEMPLATE,
    description: "",
  })
  
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [customSubject, setCustomSubject] = useState("")
  const [customBody, setCustomBody] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState("")

  const notify = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  useEffect(() => {
    fetchBatches()
    fetchTemplates()
  }, [])

  const fetchBatches = async () => {
    try {
      const response = await fetch("/api/admin/bulk-email?type=batches", { headers: { "x-admin-key": API_KEY } })
      if (response.ok) {
        const data = await response.json()
        setBatches(data)
      } else {
        const result = await response.json()
        console.error("Failed to fetch batches:", result)
        notify("error", "Failed to load batches: " + (result.details || result.error))
      }
    } catch (error) {
      console.error("Failed to fetch batches:", error)
      notify("error", "Failed to load batches")
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/bulk-email?type=templates", { headers: { "x-admin-key": API_KEY } })
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    }
  }

  const fetchContacts = async (batchId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/bulk-email?type=contacts&batchId=${batchId}`, { headers: { "x-admin-key": API_KEY } })
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setCsvText(event.target?.result as string)
    reader.readAsText(file)
  }

  const handleImportCSV = async () => {
    if (!csvText.trim()) return notify("error", "Please upload or paste CSV data")
    setImporting(true)
    try {
      const response = await fetch("/api/admin/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": API_KEY },
        body: JSON.stringify({ action: "import", csvData: csvText }),
      })
      const result = await response.json()
      if (response.ok) {
        notify("success", `Imported ${result.count} contacts`)
        setCsvText("")
        setShowUpload(false)
        fetchBatches()
      } else {
        notify("error", result.details || result.error || "Import failed")
      }
    } catch (error) {
      notify("error", "Failed to import CSV")
    } finally {
      setImporting(false)
    }
  }

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) return notify("error", "Please fill all fields")
    setLoading(true)
    try {
      const response = await fetch("/api/admin/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": API_KEY },
        body: JSON.stringify({ action: "createTemplate", ...newTemplate }),
      })
      if (response.ok) {
        const template = await response.json()
        setTemplates([template, ...templates])
        setNewTemplate({ name: "", subject: "", body: DEFAULT_OUTREACH_TEMPLATE, description: "" })
        setShowTemplateForm(false)
        notify("success", "Template created")
      }
    } catch (error) {
      notify("error", "Failed to create template")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm("Delete this batch?")) return
    try {
      const response = await fetch("/api/admin/bulk-email", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-key": API_KEY },
        body: JSON.stringify({ type: "batch", batchId }),
      })
      if (response.ok) {
        setBatches(batches.filter((b) => b._id !== batchId))
        setContacts([])
        setSelectedBatch("")
        notify("success", "Batch deleted")
      }
    } catch (error) {
      notify("error", "Failed to delete batch")
    }
  }

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t._id === templateId)
    if (template) {
      setCustomSubject(template.subject)
      setCustomBody(template.body)
    }
  }

  const handlePreview = () => {
    const html = customBody
      .replace(/{{businessName}}/gi, "Sample Business")
      .replace(/{{city}}/gi, "Charlotte")
      .replace(/{{state}}/gi, "North Carolina")
      .replace(/{{category}}/gi, "Technology")
    setPreviewHtml(html)
    setShowPreview(true)
  }

  const handleSendBulk = async () => {
    if (!selectedBatch) return notify("error", "Select a batch")
    if (!customSubject || !customBody) return notify("error", "Provide subject and body")
    if (!confirm("Send emails to all pending contacts?")) return
    setSending(true)
    try {
      const response = await fetch("/api/admin/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": API_KEY },
        body: JSON.stringify({ action: "sendBulk", batchId: selectedBatch, templateId: selectedTemplate || undefined, customSubject, customBody }),
      })
      const result = await response.json()
      if (response.ok) {
        notify("success", result.message)
        fetchBatches()
        if (selectedBatch) fetchContacts(selectedBatch)
      } else {
        notify("error", result.error || "Failed to send")
      }
    } catch (error) {
      notify("error", "Failed to send emails")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bulk Email" 
        description="Import contacts and send mass email campaigns"
        action={
          <Button onClick={() => setShowUpload(!showUpload)} className="bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
        }
      />

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* CSV Upload */}
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Contacts</CardTitle>
            <CardDescription>CSV columns: Business Name, Email, City, State, Category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload CSV file</p>
              </label>
            </div>
            <Textarea rows={4} placeholder="Or paste CSV content here..." value={csvText} onChange={(e) => setCsvText(e.target.value)} />
            <Button onClick={handleImportCSV} disabled={importing} className="w-full bg-blue-600 hover:bg-blue-700">
              {importing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Importing...</> : <>Import Contacts</>}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Imported Batches</CardTitle>
          <CardDescription>{batches.length} batches</CardDescription>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No batches yet. Import a CSV to get started.</p>
          ) : (
            <div className="space-y-3">
              {batches.map((batch) => (
                <div
                  key={batch._id}
                  className={`p-4 border rounded-lg cursor-pointer transition ${selectedBatch === batch._id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => { setSelectedBatch(batch._id); fetchContacts(batch._id) }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-sm">{batch._id}</p>
                      <p className="text-xs text-gray-500">{new Date(batch.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">{batch.count} total</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">{batch.pending} pending</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{batch.sent} sent</span>
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteBatch(batch._id) }} className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedBatch && contacts.length > 0 && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium text-sm">Contacts ({contacts.length})</div>
              <div className="max-h-48 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-3">Business</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-left py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.slice(0, 10).map((c) => (
                      <tr key={c._id} className="border-t">
                        <td className="py-2 px-3">{c.businessName}</td>
                        <td className="py-2 px-3 text-gray-600">{c.email}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${c.status === "sent" ? "bg-green-100 text-green-700" : c.status === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Bulk */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Send Bulk Emails</CardTitle>
          <CardDescription>Select batch and template, then send</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Batch</label>
              <select className="w-full px-3 py-2 border rounded-md" value={selectedBatch} onChange={(e) => { setSelectedBatch(e.target.value); if (e.target.value) fetchContacts(e.target.value) }}>
                <option value="">-- Select batch --</option>
                {batches.map((b) => <option key={b._id} value={b._id}>{b._id} ({b.pending} pending)</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Template</label>
              <select className="w-full px-3 py-2 border rounded-md" value={selectedTemplate} onChange={(e) => handleSelectTemplate(e.target.value)}>
                <option value="">-- Select template --</option>
                {templates.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <Input placeholder="Subject" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} />
          <Textarea rows={8} placeholder="Body (HTML)" value={customBody} onChange={(e) => setCustomBody(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handlePreview} variant="outline"><Eye className="h-4 w-4 mr-2" />Preview</Button>
            <Button onClick={handleSendBulk} disabled={sending || !selectedBatch} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : <><Send className="h-4 w-4 mr-2" />Send Emails</>}
            </Button>
          </div>

          {showPreview && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">Email Preview</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="p-4 overflow-auto max-h-[calc(80vh-60px)]">
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsTab({ onLogout }: { onLogout: () => void }) {
  const [settings, setSettings] = useState({
    siteName: "Techtics",
    siteEmail: "mohan0512vittal@gmail.comm",
    sitePhone: "+1 (704) 490-0265",
    aboutText: "Digital solutions company",
  })
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleSaveSettings = () => {
    setMessage({ type: "success", text: "Settings saved successfully!" })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields" })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    setLoading(true)
    try {
      localStorage.setItem("adminPassword", newPassword)
      localStorage.removeItem("sessionToken")
      setMessage({ type: "success", text: "Password updated! Please log in again." })
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => onLogout(), 2000)
    } catch {
      setMessage({ type: "error", text: "Failed to update password" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Configure your site and security settings"
      />

      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">General Settings</CardTitle>
          <CardDescription>Basic site configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Site Name</label>
              <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Contact Email</label>
              <Input value={settings.siteEmail} onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Phone Number</label>
              <Input value={settings.sitePhone} onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">About Text</label>
              <Input value={settings.aboutText} onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })} />
            </div>
          </div>
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
          <CardDescription>Update your admin password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">New Password</label>
              <Input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Confirm Password</label>
              <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleUpdatePassword} disabled={loading} variant="destructive">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, description, icon, color }: { title: string; value: string; description: string; icon?: React.ReactNode; color?: string }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }
  const bgClass = color ? colorClasses[color as keyof typeof colorClasses] : "bg-gray-50 text-gray-600"

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          </div>
          {icon && (
            <div className={`p-2 rounded-lg ${bgClass}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
