"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsItem {
  type?: string
  block?: string
  status?: string
  month?: string
  count: number
}

interface AnalyticsData {
  requestsByType: AnalyticsItem[]
  requestsByStatus: AnalyticsItem[]
  requestsByBlock: AnalyticsItem[]
  recentTrends: AnalyticsItem[]
}

export function RequestAnalytics() {
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        // Fetch analytics from backend
        const response = await fetch("http://localhost:5000/api/employee/analytics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch analytics")
        }

        setAnalytics(data.data || null)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setError(error instanceof Error ? error.message : "An error occurred while fetching analytics")

        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load analytics",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [toast])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "electrical":
        return "bg-indigo-100 text-indigo-800"
      case "plumbing":
        return "bg-blue-100 text-blue-800"
      case "internet":
        return "bg-cyan-100 text-cyan-800"
      case "cleaning":
        return "bg-teal-100 text-teal-800"
      case "laundry":
        return "bg-green-100 text-green-800"
      case "other":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderBarChart = (data: AnalyticsItem[], keyField: "type" | "block" | "status" | "month") => {
    if (!data || !data.length) return null

    const maxCount = Math.max(...data.map((item) => item.count))

    return (
      <div className="space-y-2">
        {data.map((item, index) => {
          const key = item[keyField] as string
          const percentage = (item.count / maxCount) * 100

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  {keyField === "type" && (
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${getTypeColor(key).split(" ")[0]}`}
                    ></span>
                  )}
                  {keyField === "status" && (
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(key).split(" ")[0]}`}
                    ></span>
                  )}
                  <span className="capitalize">{key}</span>
                </div>
                <span className="font-medium">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    keyField === "type"
                      ? getTypeColor(key).split(" ")[0]
                      : keyField === "status"
                        ? getStatusColor(key).split(" ")[0]
                        : "bg-primary"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics data.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Most Requested Services</CardTitle>
          </CardHeader>
          <CardContent>{renderBarChart(analytics.requestsByType, "type")}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Requests by Status</CardTitle>
          </CardHeader>
          <CardContent>{renderBarChart(analytics.requestsByStatus, "status")}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Requests by Block</CardTitle>
          </CardHeader>
          <CardContent>{renderBarChart(analytics.requestsByBlock, "block")}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>{renderBarChart(analytics.recentTrends, "month")}</CardContent>
        </Card>
      </div>
    </div>
  )
}
