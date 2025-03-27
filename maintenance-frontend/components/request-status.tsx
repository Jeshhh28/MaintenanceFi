"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"

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

type RequestStatus = "pending" | "approved" | "completed" | "rejected"

interface Request {
  id: string
  date: string
  type: string
  description: string
  status: RequestStatus
  comments: string[]
}

export function RequestStatus() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

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

  const getStatusColor = (status: RequestStatus) => {
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

  const viewRequestDetails = (request: Request) => {
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
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "completed", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {requests.filter((req) => tab === "all" || req.status === tab).length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No {tab} requests found.</p>
            ) : (
              requests
                .filter((req) => tab === "all" || req.status === tab)
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
                      <div className="mb-3">
                        <p className="text-sm font-medium capitalize">{request.type} Issue</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => viewRequestDetails(request)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
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
              </div>

              <Button className="w-full mt-6" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

