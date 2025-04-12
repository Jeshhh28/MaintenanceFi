"use client"

import React from "react"

function RequestManagement() {
  const [requests, setRequests] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedRequest, setSelectedRequest] = React.useState(null)
  const [responseComment, setResponseComment] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("pending")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")

  // Mock data - would be fetched from your backend
  const MOCK_REQUESTS = [
    {
      id: "REQ-001",
      date: "2023-11-15",
      regNo: "S12345",
      studentName: "John Doe",
      block: "A",
      roomNumber: "203",
      type: "electrical",
      description: "Light fixture not working in room",
      status: "pending",
      comments: [],
    },
    {
      id: "REQ-002",
      date: "2023-11-14",
      regNo: "S12346",
      studentName: "Jane Smith",
      block: "B",
      roomNumber: "105",
      type: "plumbing",
      description: "Leaking faucet in bathroom that needs immediate attention",
      status: "pending",
      comments: [],
    },
    {
      id: "REQ-003",
      date: "2023-11-13",
      regNo: "S12347",
      studentName: "Michael Johnson",
      block: "C",
      roomNumber: "310",
      type: "internet",
      description: "WiFi connection drops frequently in the evening",
      status: "pending",
      comments: [],
    },
    {
      id: "REQ-004",
      date: "2023-11-12",
      regNo: "S12348",
      studentName: "Emily Williams",
      block: "A",
      roomNumber: "115",
      type: "cleaning",
      description: "Request for room cleaning after water leak",
      status: "pending",
      comments: [],
    },
  ]

  React.useEffect(() => {
    // Simulate API call to fetch requests
    const fetchRequests = async () => {
      try {
        // This would be replaced with actual API call to your backend
        // Example:
        /*
        const response = await fetch('your-backend-url/api/employee/requests', {
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

  const formatDate = (dateString) => {
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
      // This would be replaced with actual API call to your backend
      // Example:
      /*
      const response = await fetch(`your-backend-url/api/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ comment: responseComment })
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve request');
      }
      */

      // For now, we'll simulate a successful approval
      await new Promise((resolve) => setTimeout(resolve, 800))

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "approved",
                comments: [...req.comments, responseComment],
              }
            : req,
        ),
      )

      setSuccessMessage(`Request ${requestId} has been approved.`)
      setTimeout(() => setSuccessMessage(""), 3000)

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      setErrorMessage("There was an error processing your request.")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  const handleReject = async (requestId) => {
    if (!responseComment.trim()) {
      setErrorMessage("Please add a comment before rejecting the request.")
      return
    }

    try {
      // This would be replaced with actual API call to your backend
      // Example:
      /*
      const response = await fetch(`your-backend-url/api/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ comment: responseComment })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      */

      // For now, we'll simulate a successful rejection
      await new Promise((resolve) => setTimeout(resolve, 800))

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "rejected",
                comments: [...req.comments, responseComment],
              }
            : req,
        ),
      )

      setSuccessMessage(`Request ${requestId} has been rejected.`)
      setTimeout(() => setSuccessMessage(""), 3000)

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      setErrorMessage("There was an error processing your request.")
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
          <div className={`tab ${activeTab === "rejected" ? "active" : ""}`} onClick={() => setActiveTab("rejected")}>
            Rejected
          </div>
        </div>

        {["pending", "approved", "rejected"].map((tab) => (
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
                            <p className="text-sm text-muted mt-1">{formatDate(request.date)}</p>
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
                            <span className="text-sm">{request.studentName}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span className="text-sm">
                              Block {request.block}, Room {request.roomNumber}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium capitalize">{request.type} Issue</p>
                          <p className="text-sm text-muted">{request.description}</p>
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
                  <p>{formatDate(selectedRequest.date)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Student</p>
                  <p>
                    {selectedRequest.studentName} ({selectedRequest.regNo})
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted">Location</p>
                  <p>
                    Block {selectedRequest.block}, Room {selectedRequest.roomNumber}
                  </p>
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
              </div>

              {selectedRequest.status !== "pending" && (
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
