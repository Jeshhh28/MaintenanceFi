"use client"

import { useState, useEffect } from "react"
import supabase from "../supabaseClient"

function RequestStatus() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw new Error("You must be logged in to view requests")
        }

        // Fetch requests for the current user
        const { data, error: requestsError } = await supabase
          .from("requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (requestsError) {
          throw new Error(requestsError.message || "Failed to fetch requests")
        }

        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
        setError(error.message || "An error occurred while fetching your requests")
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
    if (!dateString) return "N/A"
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

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>
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
                            <p className="text-sm text-muted mt-1">{formatDate(request.created_at)}</p>
                          </div>
                          <span className={`badge ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="card-content p-4 pt-2">
                        <div className="mb-3">
                          <p className="text-sm font-medium capitalize">{request.work_type} Issue</p>
                          <p className="text-sm text-muted">{request.comments}</p>
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
                  <p>{formatDate(selectedRequest.created_at)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Type</p>
                  <p className="capitalize">{selectedRequest.work_type}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Description</p>
                  <p>{selectedRequest.comments}</p>
                </div>

                {selectedRequest.response_comments && (
                  <div>
                    <p className="text-sm font-medium text-muted">Comments from Staff</p>
                    <p>{selectedRequest.response_comments}</p>
                  </div>
                )}

                {selectedRequest.file_url && (
                  <div>
                    <p className="text-sm font-medium text-muted">Attached File</p>
                    <a
                      href={selectedRequest.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Attachment
                    </a>
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

export default RequestStatus
