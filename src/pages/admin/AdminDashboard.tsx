"use client"

import type React from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import { Container, Nav, Navbar, Button } from "react-bootstrap"
import { useAuth } from "../../context/AuthContext"
import RequestManagement from "./RequestManagement"
import ReportGeneration from "./ReportGeneration"

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="admin-dashboard d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Maintenance Requisition System - Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin/requests" active={location.pathname === "/admin/requests"}>
                Manage Requests
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/reports" active={location.pathname === "/admin/reports"}>
                Generate Reports
              </Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3">
                Signed in as: <span className="fw-bold">{user?.name}</span>
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
          <Route path="/" element={<RequestManagement />} />
          <Route path="/requests" element={<RequestManagement />} />
          <Route path="/reports" element={<ReportGeneration />} />
        </Routes>
      </Container>

      <footer className="bg-light py-3 text-center">
        <Container>
          <p className="text-muted mb-0">
            &copy; {new Date().getFullYear()} Students' Maintenance Requisition System - Admin Portal
          </p>
        </Container>
      </footer>
    </div>
  )
}

export default AdminDashboard

