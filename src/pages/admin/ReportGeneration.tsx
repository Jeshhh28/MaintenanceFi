"use client"

import type React from "react"
import { useState } from "react"
import { Card, Form, Row, Col, Button, Alert } from "react-bootstrap"
import { FileEarmarkExcel, FileEarmarkPdf } from "react-bootstrap-icons"

const ReportGeneration: React.FC = () => {
  const [reportType, setReportType] = useState("all")
  const [dateRange, setDateRange] = useState("weekly")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [workType, setWorkType] = useState("all")
  const [studentRegNo, setStudentRegNo] = useState("")
  const [fileFormat, setFileFormat] = useState("excel")
  const [generating, setGenerating] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")
    setError("")
    setGenerating(true)

    try {
      // This is where you would make an API call to your backend
      // For demonstration, we'll simulate an API call

      // Validate date range if custom is selected
      if (dateRange === "custom" && (!startDate || !endDate)) {
        throw new Error("Please select both start and end dates for custom date range")
      }

      // Validate student reg no if student-wise report is selected
      if (reportType === "student" && !studentRegNo) {
        throw new Error("Please enter a student registration number")
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful report generation
      setSuccess(`Report generated successfully in ${fileFormat.toUpperCase()} format!`)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to generate report. Please try again.")
      }
      console.error("Report generation error:", err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">Generate Maintenance Reports</h4>
      </Card.Header>
      <Card.Body>
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleGenerateReport}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)} required>
                  <option value="all">All Requests</option>
                  <option value="student">Student-wise</option>
                  <option value="status">Status-wise</option>
                </Form.Select>
              </Form.Group>

              {reportType === "student" && (
                <Form.Group className="mb-3">
                  <Form.Label>Student Registration Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter registration number"
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Work Type</Form.Label>
                <Form.Select value={workType} onChange={(e) => setWorkType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="internet">Internet</option>
                  <option value="laundry">Laundry</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date Range</Form.Label>
                <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} required>
                  <option value="daily">Daily (Today)</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom Range</option>
                </Form.Select>
              </Form.Group>

              {dateRange === "custom" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>File Format</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="excel-format"
                    label={
                      <>
                        <FileEarmarkExcel className="me-1" /> Excel
                      </>
                    }
                    name="fileFormat"
                    value="excel"
                    checked={fileFormat === "excel"}
                    onChange={() => setFileFormat("excel")}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="pdf-format"
                    label={
                      <>
                        <FileEarmarkPdf className="me-1" /> PDF
                      </>
                    }
                    name="fileFormat"
                    value="pdf"
                    checked={fileFormat === "pdf"}
                    onChange={() => setFileFormat("pdf")}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary" size="lg" disabled={generating}>
              {generating ? "Generating Report..." : "Generate Report"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ReportGeneration

