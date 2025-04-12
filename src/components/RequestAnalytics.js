"use client"

import { useState, useEffect } from "react"
import supabase from "../supabaseClient"

function RequestAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw new Error("You must be logged in to view analytics")
        }

        // Fetch all requests to calculate analytics
        const { data: requestsData, error: requestsError } = await supabase.from("requests").select("*")

        if (requestsError) {
          throw new Error(requestsError.message || "Failed to fetch requests for analytics")
        }

        // Process data for analytics
        const requests = requestsData || []

        // Calculate requests by type
        const typeCount = {}
        requests.forEach((req) => {
          typeCount[req.work_type] = (typeCount[req.work_type] || 0) + 1
        })

        const requestsByType = Object.keys(typeCount).map((type) => ({
          type,
          count: typeCount[type],
        }))

        // Calculate requests by status
        const statusCount = {}
        requests.forEach((req) => {
          statusCount[req.status] = (statusCount[req.status] || 0) + 1
        })

        const requestsByStatus = Object.keys(statusCount).map((status) => ({
          status,
          count: statusCount[status],
        }))

        // Calculate requests by block
        const blockCount = {}
        requests.forEach((req) => {
          blockCount[req.block] = (blockCount[req.block] || 0) + 1
        })

        const requestsByBlock = Object.keys(blockCount).map((block) => ({
          block,
          count: blockCount[block],
        }))

        // Calculate monthly trends
        const monthlyData = {}
        requests.forEach((req) => {
          const date = new Date(req.created_at)
          const month = date.toLocaleString("default", { month: "short" })
          monthlyData[month] = (monthlyData[month] || 0) + 1
        })

        const recentTrends = Object.keys(monthlyData).map((month) => ({
          month,
          count: monthlyData[month],
        }))

        setAnalytics({
          requestsByType,
          requestsByStatus,
          requestsByBlock,
          recentTrends,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setError(error.message || "An error occurred while fetching analytics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const getTypeColor = (type) => {
    switch (type) {
      case "electrical":
        return "bg-indigo-100"
      case "plumbing":
        return "bg-blue-100"
      case "internet":
        return "bg-cyan-100"
      case "cleaning":
        return "bg-teal-100"
      case "laundry":
        return "bg-green-100"
      case "other":
        return "bg-gray-100"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100"
      case "approved":
        return "bg-blue-100"
      case "completed":
        return "bg-green-100"
      case "rejected":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  const renderBarChart = (data, keyField) => {
    if (!data || !data.length) return null

    const maxCount = Math.max(...data.map((item) => item.count))

    return (
      <div className="space-y-2">
        {data.map((item, index) => {
          const key = item[keyField]
          const percentage = (item.count / maxCount) * 100

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  {keyField === "type" && (
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getTypeColor(key)}`}></span>
                  )}
                  {keyField === "status" && (
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(key)}`}></span>
                  )}
                  <span className="capitalize">{key}</span>
                </div>
                <span className="font-medium">{item.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    keyField === "type" ? getTypeColor(key) : keyField === "status" ? getStatusColor(key) : "bg-primary"
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
    return <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Failed to load analytics data.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header pb-2">
            <h3 className="card-title text-base">Most Requested Services</h3>
          </div>
          <div className="card-content">{renderBarChart(analytics.requestsByType, "type")}</div>
        </div>

        <div className="card">
          <div className="card-header pb-2">
            <h3 className="card-title text-base">Requests by Status</h3>
          </div>
          <div className="card-content">{renderBarChart(analytics.requestsByStatus, "status")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header pb-2">
            <h3 className="card-title text-base">Requests by Block</h3>
          </div>
          <div className="card-content">{renderBarChart(analytics.requestsByBlock, "block")}</div>
        </div>

        <div className="card">
          <div className="card-header pb-2">
            <h3 className="card-title text-base">Monthly Trends</h3>
          </div>
          <div className="card-content">{renderBarChart(analytics.recentTrends, "month")}</div>
        </div>
      </div>
    </div>
  )
}

export default RequestAnalytics
