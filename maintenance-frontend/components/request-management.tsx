"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, FileText, User, MapPin } from "lucide-react"

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

type RequestStatus = "pending" | "approved" | "rejected" | "completed"

interface Request {
  id: string
  date: string
  regNo: string
  studentName: string
  block: string
  roomNumber: string
  type: string
  description: string
  status: RequestStatus
  comments: string[]
}

export function RequestManagement() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [responseComment, setResponseComment] = useState("")

  useEffect(() => {
    // Simulate API call to fetch requests
    const fetchRequests = async () => {
      try {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

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

  const handleApprove = async (requestId: string) => {
    if (!responseComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please add a comment before approving the request.",
        variant: "destructive",
      })
      return
    }

    try {
      // This would be replaced with actual API call to your backend
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

      toast({
        title: "Request Approved",
        description: `Request ${requestId} has been approved.`,
      })

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (requestId: string) => {
    if (!responseComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please add a comment before rejecting the request.",
        variant: "destructive",
      })
      return
    }

    try {
      // This would be replaced with actual API call to your backend
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

      toast({
        title: "Request Rejected",
        description: `Request ${requestId} has been rejected.`,
      })

      setSelectedRequest(null)
      setResponseComment("")
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error processing your request.",
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

  return (
    <div>
      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected"].map((tab) => (
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
                            {request.id}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{formatDate(request.date)}</p>
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
                          <span className="text-sm">{request.studentName}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">
                            Block {request.block}, Room {request.roomNumber}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm font-medium capitalize">{request.type} Issue</p>
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
                  <p>{selectedRequest.id}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Submitted</p>
                  <p>{formatDate(selectedRequest.date)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student</p>
                  <p>
                    {selectedRequest.studentName} ({selectedRequest.regNo})
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>
                    Block {selectedRequest.block}, Room {selectedRequest.roomNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="capitalize">{selectedRequest.type}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{selectedRequest.description}</p>
                </div>

                {selectedRequest.comments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Comments</p>
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
              </div>

              {selectedRequest.status !== "pending" && (
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

