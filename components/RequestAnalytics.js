"use client"

import React from "react"

function RequestAnalytics() {
  const [analytics, setAnalytics] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Mock data - would be fetched from your backend
  const MOCK_ANALYTICS = {
    requestsByType: [
      { type: "electrical", count: 42 },
      { type: "plumbing", count: 28 },
      { type: "internet", count: 35 },
      { type: "cleaning", count: 20 },
      { type: "laundry", count: 15 },
      { type: "other", count: 10 },
    ],
    requestsByBlock: [
      { block: "A", count: 45 },
      { block: "B", count: 38 },
      { block: "C", count: 32 },
      { block: "D", count: 25 },
      { block: "E", count: 10 },
    ],
    requestsByStatus: [
      { status: "pending", count: 28 },
      { status: "approved", count: 35 },
      { status: "completed", count: 72 },
      { status: "rejected", count: 15 },
    ],
    recentTrends: [
      { month: "Jul", count: 35 },
      { month: "Aug", count: 42 },
      { month: "Sep", count: 38 },
      { month: "Oct", count: 45 },
      { month: "Nov", count: 50 },
    ],
  }

  React.useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalytics = async () => {
      try {
        // This would be replaced with actual API call to your backend
        // Example:
        /*
        const response = await fetch('your-backend-url/api/analytics', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        
        const data = await response.json();
        setAnalytics(data);
        */

        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setAnalytics(MOCK_ANALYTICS)
      } catch (error) {
        console.error("Error fetching analytics:", error)
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
