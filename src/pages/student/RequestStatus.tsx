"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, Table, Badge, Spinner } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"

interface Request {
  id: string
  regNo: string
  name: string
  blockRoom: string
  workType: string
  requestType: string
  comments: string
  status: "pending" | "approved" | "rejected" | "completed"
  submittedAt: string
  updatedAt: string | null
}

const RequestStatus: React.FC = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // This is where you would make an API call to your backend
        // For demonstration, we'll use mock data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockRequests: Request[] = [
          {
            id: "1",
            regNo: user?.regNo || "S12345",
            name: user?.name || "Student User",
            blockRoom: "A-101",
            workType: "electrical",
            requestType: "requisition",
            comments: "Light fixture not working in my room",
            status: "approved",
            submittedAt: "2023-05-15T10:30:00Z",
            updatedAt: "2023-05-16T14:20:00Z",
          },
          {
            id: "2",
            regNo: user?.regNo || "S12345",
            name: user?.name || "Student User",
            blockRoom: "A-101",
            workType: "plumbing",
            requestType: "requisition",
            comments: "Water leakage from bathroom sink",
            status: "pending",
            submittedAt: "2023-05-18T09:15:00Z",
            updatedAt: null,
          },
          {
            id: "3",
            regNo: user?.regNo || "S12345",
            name: user?.name || "Student User",
            blockRoom: "A-101",
            workType: "internet",
            requestType: "feedback",
            comments: "WiFi signal is weak in my room",
            status: "rejected",
            submittedAt: "2023-05-10T16:45:00Z",
            updatedAt: "2023-05-11T11:30:00Z",
          },
          {
            id: "4",
            regNo: user?.regNo || "S12345",
            name: user?.name || "Student User",
            blockRoom: "A-101",
            workType: "cleaning",
            requestType: "requisition",
            comments: "Need room cleaning service",
            status: "completed",
            submittedAt: "2023-05-05T08:20:00Z",
            updatedAt: "2023-05-06T10:15:00Z",
          },
        ]

        setRequests(mockRequests)
      } catch (err) {
        setError("Failed to fetch requests. Please try again later.")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge bg="warning">Pending</Badge>
      case "approved":
        return <Badge bg="success">Approved</Badge>
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>
      case "completed":
        return <Badge bg="info">Completed</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <p className="text-danger">{error}</p>
        </Card.Body>
      </Card>
    )
  }

  if (requests.length === 0) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <p>You haven't submitted any maintenance requests yet.</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">Your Maintenance Requests</h4>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Work Type</th>
                <th>Request Type</th>
                <th>Block & Room</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td className="text-capitalize">{request.workType}</td>
                  <td className="text-capitalize">{request.requestType}</td>
                  <td>{request.blockRoom}</td>
                  <td>{formatDate(request.submittedAt)}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>{request.updatedAt ? formatDate(request.updatedAt) : "Not updated yet"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  )
}

export default RequestStatus

