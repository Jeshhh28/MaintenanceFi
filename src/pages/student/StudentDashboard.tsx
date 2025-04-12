"use client"

import type React from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { Container, Nav, Navbar, Button } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"
import RequestForm from "./RequestForm"
import RequestStatus from "./RequestStatus"

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="student-dashboard d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Maintenance Requisition System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/student/new-request" active={location.pathname === "/student/new-request"}>
                New Request
              </Nav.Link>
              <Nav.Link as={Link} to="/student/request-status" active={location.pathname === "/student/request-status"}>
                Request Status
              </Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
                Signed in as:{" "}
                <span className="fw-bold">
                  {user?.name} ({user?.regNo})
                </span>
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={logout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<RequestForm />} />
          <Route path="/new-request" element={<RequestForm />} />
          <Route path="/request-status" element={<RequestStatus />} />
        </Routes>
      </Container>

      <footer className="bg-light py-3 text-center">
        <Container>
          <p className="text-muted mb-0">&copy; {new Date().getFullYear()} Students' Maintenance Requisition System</p>
        </Container>
      </footer>
    </div>
  )
}

export default StudentDashboard

