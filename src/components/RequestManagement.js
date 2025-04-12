"use client"

import { useState, useEffect } from "react"
import supabase from "../supabaseClient"

function RequestManagement() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [responseComment, setResponseComment] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

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

        // Fetch all requests
        const { data, error: requestsError } = await supabase
          .from("requests")
          .select("*")
          .order("created_at", { ascending: false })

        if (requestsError) {
          throw new Error(requestsError.message || "Failed to fetch requests")
        }

        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
        setErrorMessage(error.message || "An error occurred while fetching requests")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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

  const handleApprove = async (requestId) => {
    if (!responseComment.trim()) {
      setErrorMessage("Please add a comment before approving the request.")
      return
    }

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to approve requests")
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from("requests")
        .update({
          status: "approved",
          response_comments: responseComment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (updateError) {
        throw new Error(updateError.message || "Failed to approve request")
      }

      // Update the local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "approved",
                response_comments: responseComment,
                updated_at: new Date().toISOString(),
              }
            : req,
        ),
      )

      setSuccessMessage(`Request ${requestId} has been approved.`)
      setTimeout(() => setSuccessMessage(""), 3000)

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      console.error("Error approving request:", error)
      setErrorMessage(error.message || "There was an error processing your request.")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  const handleReject = async (requestId) => {
    if (!responseComment.trim()) {
      setErrorMessage("Please add a comment before rejecting the request.")
      return
    }

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to reject requests")
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from("requests")
        .update({
          status: "rejected",
          response_comments: responseComment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (updateError) {
        throw new Error(updateError.message || "Failed to reject request")
      }

      // Update the local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "rejected",
                response_comments: responseComment,
                updated_at: new Date().toISOString(),
              }
            : req,
        ),
      )

      setSuccessMessage(`Request ${requestId} has been rejected.`)
      setTimeout(() => setSuccessMessage(""), 3000)

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      console.error("Error rejecting request:", error)
      setErrorMessage(error.message || "There was an error processing your request.")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  const handleComplete = async (requestId) => {
    if (!responseComment.trim()) {
      setErrorMessage("Please add a comment before marking as completed.")
      return
    }

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to complete requests")
      }

      // Update the request status
      const { error: updateError } = await supabase
        .from("requests")
        .update({
          status: "completed",
          response_comments: responseComment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (updateError) {
        throw new Error(updateError.message || "Failed to complete request")
      }

      // Update the local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "completed",
                response_comments: responseComment,
                updated_at: new Date().toISOString(),
              }
            : req,
        ),
      )

      setSuccessMessage(`Request ${requestId} has been marked as completed.`)
      setTimeout(() => setSuccessMessage(""), 3000)

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      console.error("Error completing request:", error)
      setErrorMessage(error.message || "There was an error processing your request.")
      setTimeout(() => setErrorMessage(""), 3000)
    }
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
      {successMessage && <div className="bg-green-500 text-white p-4 rounded-lg mb-4">{successMessage}</div>}

      {errorMessage && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{errorMessage}</div>}

      <div className="tabs">
        <div className="tabs-list grid grid-cols-3 mb-6">
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

        {["pending", "approved", "completed", "rejected"].map((tab) => (
          <div key={tab} className={`tab-content ${activeTab === tab ? "active" : ""}`}>
            {requests.filter((req) => req.status === tab).length === 0 ? (
              <p className="text-center py-8 text-muted">No {tab} requests found.</p>
            ) : (
              <div className="space-y-4">
                {requests
                  .filter((req) => req.status === tab)
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
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center">
                            <span className="mr-2">👤</span>
                            <span className="text-sm">{request.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span className="text-sm">
                              Block {request.block}, Room {request.room_number}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium capitalize">{request.work_type} Issue</p>
                          <p className="text-sm text-muted">{request.comments}</p>
                        </div>
                        <button className="btn btn-outline btn-sm w-full" onClick={() => setSelectedRequest(request)}>
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
                  <p className="text-sm font-medium text-muted">Student</p>
                  <p>
                    {selectedRequest.name} ({selectedRequest.reg_no})
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Location</p>
                  <p>
                    Block {selectedRequest.block}, Room {selectedRequest.room_number}
                  </p>
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
                    <p className="text-sm font-medium text-muted">Staff Comments</p>
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

                {selectedRequest.status === "pending" && (
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Add Response</p>
                    <textarea
                      value={responseComment}
                      onChange={(e) => setResponseComment(e.target.value)}
                      placeholder="Add your comment or instructions here..."
                      rows={3}
                      className="form-textarea mb-4"
                    ></textarea>
                    <div className="flex space-x-3">
                      <button className="btn btn-outline flex-1" onClick={() => handleReject(selectedRequest.id)}>
                        <span className="mr-2">❌</span>
                        Reject
                      </button>
                      <button className="btn btn-primary flex-1" onClick={() => handleApprove(selectedRequest.id)}>
                        <span className="mr-2">✅</span>
                        Approve
                      </button>
                    </div>
                  </div>
                )}

                {selectedRequest.status === "approved" && (
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Mark as Completed</p>
                    <textarea
                      value={responseComment}
                      onChange={(e) => setResponseComment(e.target.value)}
                      placeholder="Add completion notes here..."
                      rows={3}
                      className="form-textarea mb-4"
                    ></textarea>
                    <button className="btn btn-primary w-full" onClick={() => handleComplete(selectedRequest.id)}>
                      <span className="mr-2">✓</span>
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>

              {(selectedRequest.status === "completed" || selectedRequest.status === "rejected") && (
                <button className="btn btn-primary w-full mt-6" onClick={() => setSelectedRequest(null)}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestManagement
