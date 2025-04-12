"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, Table, Badge, Button, Form, Row, Col, Modal, Spinner } from "react-bootstrap"
import { Search, Filter } from "react-bootstrap-icons"

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
  proofFile?: string
}

const RequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [workTypeFilter, setWorkTypeFilter] = useState("all")

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

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
            regNo: "S12345",
            name: "John Doe",
            blockRoom: "A-101",
            workType: "electrical",
            requestType: "requisition",
            comments: "Light fixture not working in my room",
            status: "pending",
            submittedAt: "2023-05-15T10:30:00Z",
            updatedAt: null,
          },
          {
            id: "2",
            regNo: "S67890",
            name: "Jane Smith",
            blockRoom: "B-205",
            workType: "plumbing",
            requestType: "requisition",
            comments: "Water leakage from bathroom sink",
            status: "pending",
            submittedAt: "2023-05-18T09:15:00Z",
            updatedAt: null,
          },
          {
            id: "3",
            regNo: "S54321",
            name: "Alice Johnson",
            blockRoom: "C-310",
            workType: "internet",
            requestType: "feedback",
            comments: "WiFi signal is weak in my room",
            status: "pending",
            submittedAt: "2023-05-10T16:45:00Z",
            updatedAt: null,
          },
          {
            id: "4",
            regNo: "S98765",
            name: "Bob Williams",
            blockRoom: "D-420",
            workType: "cleaning",
            requestType: "requisition",
            comments: "Need room cleaning service",
            status: "approved",
            submittedAt: "2023-05-05T08:20:00Z",
            updatedAt: "2023-05-06T10:15:00Z",
          },
          {
            id: "5",
            regNo: "S24680",
            name: "Charlie Brown",
            blockRoom: "A-115",
            workType: "laundry",
            requestType: "improvement",
            comments: "Laundry service needs improvement",
            status: "rejected",
            submittedAt: "2023-05-08T14:30:00Z",
            updatedAt: "2023-05-09T11:45:00Z",
          },
        ]

        setRequests(mockRequests)
        setFilteredRequests(mockRequests)
      } catch (err) {
        setError("Failed to fetch requests. Please try again later.")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let result = [...requests]

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((request) => request.status === statusFilter)
    }

    // Apply work type filter
    if (workTypeFilter !== "all") {
      result = result.filter((request) => request.workType === workTypeFilter)
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (request) =>
          request.regNo.toLowerCase().includes(term) ||
          request.name.toLowerCase().includes(term) ||
          request.blockRoom.toLowerCase().includes(term),
      )
    }

    setFilteredRequests(result)
  }, [requests, statusFilter, workTypeFilter, searchTerm])

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedRequest(null)
  }

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected" | "completed") => {
    setActionLoading(true)

    try {
      // This is where you would make an API call to your backend
      // For demonstration, we'll simulate an API call

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      const updatedRequests = requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : request,
      )

      setRequests(updatedRequests)
      handleCloseModal()
    } catch (err) {
      console.error("Update error:", err)
      // Handle error
    } finally {
      setActionLoading(false)
    }
  }

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
        <p className="mt-3">Loading maintenance requests...</p>
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

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Manage Maintenance Requests</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search by reg no, name, or room"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text">
                    <Filter />
                  </span>
                  <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <div className="input-group">
                  <span className="input-group-text">
                    <Filter />
                  </span>
                  <Form.Select value={workTypeFilter} onChange={(e) => setWorkTypeFilter(e.target.value)}>
                    <option value="all">All Work Types</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="internet">Internet</option>
                    <option value="laundry">Laundry</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
          </Row>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-4">
              <p>No maintenance requests match your filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Reg No</th>
                    <th>Name</th>
                    <th>Block & Room</th>
                    <th>Work Type</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <tr key={request.id}>
                      <td>{index + 1}</td>
                      <td>{request.regNo}</td>
                      <td>{request.name}</td>
                      <td>{request.blockRoom}</td>
                      <td className="text-capitalize">{request.workType}</td>
                      <td>{formatDate(request.submittedAt)}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(request)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Request Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Registration No:</strong>
                  </p>
                  <p>{selectedRequest.regNo}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Student Name:</strong>
                  </p>
                  <p>{selectedRequest.name}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Block & Room:</strong>
                  </p>
                  <p>{selectedRequest.blockRoom}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Work Type:</strong>
                  </p>
                  <p className="text-capitalize">{selectedRequest.workType}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Request Type:</strong>
                  </p>
                  <p className="text-capitalize">{selectedRequest.requestType}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Status:</strong>
                  </p>
                  <p>{getStatusBadge(selectedRequest.status)}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Submitted On:</strong>
                  </p>
                  <p>{formatDate(selectedRequest.submittedAt)}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Last Updated:</strong>
                  </p>
                  <p>{selectedRequest.updatedAt ? formatDate(selectedRequest.updatedAt) : "Not updated yet"}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <p className="mb-1">
                    <strong>Comments:</strong>
                  </p>
                  <p>{selectedRequest.comments}</p>
                </Col>
              </Row>
              {selectedRequest.proofFile && (
                <Row className="mb-3">
                  <Col>
                    <p className="mb-1">
                      <strong>Proof File:</strong>
                    </p>
                    <p>
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        View Attachment
                      </a>
                    </p>
                  </Col>
                </Row>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedRequest && selectedRequest.status === "pending" && (
            <>
              <Button
                variant="danger"
                onClick={() => handleUpdateStatus(selectedRequest.id, "rejected")}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Reject Request"}
              </Button>
              <Button
                variant="success"
                onClick={() => handleUpdateStatus(selectedRequest.id, "approved")}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Approve Request"}
              </Button>
            </>
          )}
          {selectedRequest && selectedRequest.status === "approved" && (
            <Button
              variant="info"
              onClick={() => handleUpdateStatus(selectedRequest.id, "completed")}
              disabled={actionLoading}
            >
              {actionLoading ? "Processing..." : "Mark as Completed"}
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RequestManagement

