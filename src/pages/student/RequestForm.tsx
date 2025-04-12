"use client"

import type React from "react"
import { useState } from "react"
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"

interface FormData {
  regNo: string
  name: string
  block: string
  roomNo: string
  workType: string
  requestType: string
  comments: string
  proofFile: File | null
}

const RequestForm: React.FC = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    regNo: user?.regNo || "",
    name: user?.name || "",
    block: "",
    roomNo: "",
    workType: "",
    requestType: "requisition",
    comments: "",
    proofFile: null,
  })

  const [validated, setValidated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, proofFile: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (!form.checkValidity()) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // This is where you would make an API call to your backend
      // For demonstration, we'll simulate a successful submission

      // Create FormData object for file upload
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "proofFile" && value) {
          submitData.append(key, value)
        } else if (key !== "proofFile") {
          submitData.append(key, value as string)
        }
      })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form after successful submission
      setFormData({
        regNo: user?.regNo || "",
        name: user?.name || "",
        block: "",
        roomNo: "",
        workType: "",
        requestType: "requisition",
        comments: "",
        proofFile: null,
      })

      setValidated(false)
      setSubmitSuccess(true)

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (err) {
      setError("Failed to submit request. Please try again.")
      console.error("Submission error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">Submit Maintenance Request</h4>
      </Card.Header>
      <Card.Body>
        {submitSuccess && (
          <Alert variant="success" dismissible onClose={() => setSubmitSuccess(false)}>
            Your maintenance request has been submitted successfully!
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="regNo">
              <Form.Label>Registration Number</Form.Label>
              <Form.Control type="text" name="regNo" value={formData.regNo} onChange={handleChange} required readOnly />
              <Form.Control.Feedback type="invalid">Please provide your registration number.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required readOnly />
              <Form.Control.Feedback type="invalid">Please provide your full name.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="block">
              <Form.Label>Block</Form.Label>
              <Form.Control
                type="text"
                name="block"
                value={formData.block}
                onChange={handleChange}
                required
                placeholder="Enter your block (e.g., A, B, C)"
              />
              <Form.Control.Feedback type="invalid">Please provide your block.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="roomNo">
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                name="roomNo"
                value={formData.roomNo}
                onChange={handleChange}
                required
                placeholder="Enter your room number"
              />
              <Form.Control.Feedback type="invalid">Please provide your room number.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="workType">
              <Form.Label>Type of Work</Form.Label>
              <Form.Select name="workType" value={formData.workType} onChange={handleChange} required>
                <option value="">Select type of work</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="cleaning">Cleaning</option>
                <option value="internet">Internet</option>
                <option value="laundry">Laundry</option>
                <option value="other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please select the type of work.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="requestType">
              <Form.Label>Request Type</Form.Label>
              <Form.Select name="requestType" value={formData.requestType} onChange={handleChange} required>
                <option value="requisition">Requisition</option>
                <option value="suggestion">Suggestion</option>
                <option value="improvement">Improvement</option>
                <option value="feedback">Feedback</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">Please select the request type.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="comments">
            <Form.Label>Comments</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required
              placeholder="Describe your maintenance request in detail"
            />
            <Form.Control.Feedback type="invalid">Please provide details about your request.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="proofFile">
            <Form.Label>Proof (Optional)</Form.Label>
            <Form.Control
              type="file"
              name="proofFile"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Form.Text className="text-muted">Upload a file as proof (PDF, DOC, JPG formats accepted)</Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" size="lg" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default RequestForm

