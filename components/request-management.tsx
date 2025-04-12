"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, FileText, User, MapPin } from "lucide-react"

type RequestStatus = "pending" | "approved" | "completed" | "rejected"

interface Request {
  id: number
  request_number: string
  reg_no: string
  name: string
  block: string
  room_number: string
  work_type: string
  request_type: string
  description: string
  file_path: string | null
  status: RequestStatus
  response_comments: string | null
  created_at: string
  updated_at: string
  handled_by_name?: string
}

export function RequestManagement() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [responseComment, setResponseComment] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }

        // Fetch requests from backend
        const response = await fetch("http://localhost:5000/api/employee/requests", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch requests")
        }

        setRequests(data.data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
        setError(error instanceof Error ? error.message : "An error occurred while fetching requests")

        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load requests",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [toast])

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "approved":
        return "blue"
      case "completed":
        return "green"
      case "rejected":
        return "red"
      default:
        return "gray"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleApprove = async (requestId: number) => {
    if (!responseComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please add a comment before approving the request.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Send update request to backend
      const response = await fetch(`http://localhost:5000/api/employee/requests/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
          comments: responseComment,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve request")
      }

      // Update local state
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

      toast({
        title: "Request Approved",
        description: `Request ${requestId} has been approved.`,
      })

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "There was an error processing your request.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (requestId: number) => {
    if (!responseComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please add a comment before rejecting the request.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Send update request to backend
      const response = await fetch(`http://localhost:5000/api/employee/requests/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          comments: responseComment,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reject request")
      }

      // Update local state
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

      toast({
        title: "Request Rejected",
        description: `Request ${requestId} has been rejected.`,
      })

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "There was an error processing your request.",
        variant: "destructive",
      })
    }
  }

  const handleComplete = async (requestId: number) => {
    if (!responseComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please add a comment before marking as completed.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Send update request to backend
      const response = await fetch(`http://localhost:5000/api/employee/requests/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          comments: responseComment,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to complete request")
      }

      // Update local state
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

      toast({
        title: "Request Completed",
        description: `Request ${requestId} has been marked as completed.`,
      })

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "There was an error processing your request.",
        variant: "destructive",
      })
    }
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

  return (
    <div>
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["pending", "approved", "completed", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {requests.filter((req) => req.status === tab).length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No {tab} requests found.</p>
            ) : (
              requests
                .filter((req) => req.status === tab)
                .map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {request.request_number}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{formatDate(request.created_at)}</p>
                        </div>
                        <Badge variant={getStatusBadge(request.status) as any}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{request.name}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            Block {request.block}, Room {request.room_number}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-medium capitalize">{request.work_type} Issue</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Request Details</h3>
                <Badge variant={getStatusBadge(selectedRequest.status) as any}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Request ID</p>
                  <p>{selectedRequest.request_number}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                  <p>{formatDate(selectedRequest.created_at)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student</p>
                  <p>
                    {selectedRequest.name} ({selectedRequest.reg_no})
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>
                    Block {selectedRequest.block}, Room {selectedRequest.room_number}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="capitalize">{selectedRequest.work_type}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{selectedRequest.description}</p>
                </div>

                {selectedRequest.response_comments && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Staff Comments</p>
                    <p>{selectedRequest.response_comments}</p>
                  </div>
                )}

                {selectedRequest.file_path && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Attached File</p>
                    <a
                      href={`http://localhost:5000${selectedRequest.file_path}`}
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
                    <Textarea
                      value={responseComment}
                      onChange={(e) => setResponseComment(e.target.value)}
                      placeholder="Add your comment or instructions here..."
                      rows={3}
                      className="mb-4"
                    />
                    <div className="flex space-x-3">
                      <Button variant="outline" className="flex-1" onClick={() => handleReject(selectedRequest.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button className="flex-1" onClick={() => handleApprove(selectedRequest.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                )}

                {selectedRequest.status === "approved" && (
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Mark as Completed</p>
                    <Textarea
                      value={responseComment}
                      onChange={(e) => setResponseComment(e.target.value)}
                      placeholder="Add completion notes here..."
                      rows={3}
                      className="mb-4"
                    />
                    <Button className="w-full" onClick={() => handleComplete(selectedRequest.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </div>
                )}
              </div>

              {(selectedRequest.status === "completed" || selectedRequest.status === "rejected") && (
                <Button className="w-full mt-6" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
