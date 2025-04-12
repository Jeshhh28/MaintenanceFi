"use client"

import * as ReactRouterDOM from "react-router-dom"
import React from "react"

function LoginForm({ role }) {
  const navigate = ReactRouterDOM.useNavigate()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // This would be replaced with actual authentication logic
      // connecting to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful login
      if (username && password) {
        if (role === "student") {
          navigate("/student/dashboard")
        } else {
          navigate("/employee/dashboard")
        }
      } else {
        setError("Please enter both username and password")
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card shadow-md">
      <div className="card-header">
        <ReactRouterDOM.Link to="/" className="flex items-center text-sm text-muted mb-2">
          <span className="mr-1">←</span>
          Back to home
        </ReactRouterDOM.Link>
        <h2 className="card-title">{role === "student" ? "Student Login" : "Employee Login"}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-content space-y-4">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              {role === "student" ? "Registration Number" : "Employee ID"}
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === "student" ? "Enter your reg number" : "Enter your employee ID"}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  )
}
