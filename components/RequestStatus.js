"use client"

import React from "react"

function RequestStatus() {
  const [requests, setRequests] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedRequest, setSelectedRequest] = React.useState(null)
  const [activeTab, setActiveTab] = React.useState("all")

  // Mock data - would be fetched from your backend
  const MOCK_REQUESTS = [
    {
      id: "REQ-001",
      date: "2023-11-15",
      type: "electrical",
      description: "Light fixture not working in room",
      status: "pending",
      comments: [],
    },
    {
      id: "REQ-002",
      date: "2023-11-10",
      type: "plumbing",
      description: "Leaking faucet in bathroom",
      status: "approved",
      comments: ["Technician scheduled for Nov 20"],
    },
    {
      id: "REQ-003",
      date: "2023-11-05",
      type: "internet",
      description: "Weak WiFi signal in room",
      status: "completed",
      comments: ["Issue resolved on Nov 8", "Signal booster installed"],
    },
    {
      id: "REQ-004",
      date: "2023-10-28",
      type: "cleaning",
      description: "Request for deep cleaning of room",
      status: "rejected",
      comments: ["Regular cleaning scheduled for next week", "Deep cleaning not approved at this time"],
    },
  ]

  React.useEffect(() => {
    // Simulate API call to fetch requests
    const fetchRequests = async () => {
      try {
        // This would be replaced with actual API call to your backend
        // Example:
        /*
        const response = await fetch('your-backend-url/api/student/requests', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        
        const data = await response.json();
        setRequests(data);
        */

        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRequests(MOCK_REQUESTS)
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-yellow"
      case "approved":
        return "badge-blue"
      case "completed":
        return "badge-green"
      case "rejected":
        return "badge-red"
      default:
        return "badge-gray"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const viewRequestDetails = (request) => {
    setSelectedRequest(request)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="tabs">
        <div className="tabs-list grid grid-cols-4 mb-6">
          <div className={`tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            All
          </div>
          <div className={`tab ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>
            Pending
          </div>
          <div className={`tab ${activeTab === "approved" ? "active" : ""}`} onClick={() => setActiveTab("approved")}>
            Approved
          </div>
          <div className={`tab ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>
            Completed
          </div>
        </div>

        {["all", "pending", "approved", "completed", "rejected"].map((tab) => (
          <div key={tab} className={`tab-content ${activeTab === tab ? "active" : ""}`}>
            {requests.filter((req) => tab === "all" || req.status === tab).length === 0 ? (
              <p className="text-center py-8 text-muted">No {tab} requests found.</p>
            ) : (
              <div className="space-y-4">
                {requests
                  .filter((req) => tab === "all" || req.status === tab)
                  .map((request) => (
                    <div key={request.id} className="card">
                      <div className="card-header p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium flex items-center">
                              <span className="mr-2">📄</span>
                              {request.id}
                            </h3>
                            <p className="text-sm text-muted mt-1">{formatDate(request.date)}</p>
                          </div>
                          <span className={`badge ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="card-content p-4 pt-2">
                        <div className="mb-3">
                          <p className="text-sm font-medium capitalize">{request.type} Issue</p>
                          <p className="text-sm text-muted">{request.description}</p>
                        </div>
                        <button className="btn btn-outline btn-sm w-full" onClick={() => viewRequestDetails(request)}>
                          <span className="mr-2">👁️</span>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Request Details</h3>
                <span className={`badge ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted">Request ID</p>
                  <p>{selectedRequest.id}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Date Submitted</p>
                  <p>{formatDate(selectedRequest.date)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Type</p>
                  <p className="capitalize">{selectedRequest.type}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Description</p>
                  <p>{selectedRequest.description}</p>
                </div>

                {selectedRequest.comments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted">Comments</p>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      {selectedRequest.comments.map((comment, index) => (
                        <li key={index} className="text-sm">
                          {comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button className="btn btn-primary w-full mt-6" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
