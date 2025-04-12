"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import supabase from "../supabaseClient"

function LoginForm({ role }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: username, // Assuming username is an email
        password: password,
      })

      if (signInError) {
        throw new Error(signInError.message || "Login failed")
      }

      if (!data || !data.user) {
        throw new Error("No user data returned")
      }

      // Fetch user profile to check role
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError) {
        throw new Error(profileError.message || "Failed to fetch user profile")
      }

      if (profileData.role !== role) {
        throw new Error(`You are not authorized as a ${role}`)
      }

      // Redirect based on role
      if (role === "student") {
        navigate("/student/dashboard")
      } else {
        navigate("/employee/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card shadow-md">
      <div className="card-header">
        <Link to="/" className="flex items-center text-sm text-muted mb-2">
          <span className="mr-1">←</span>
          Back to home
        </Link>
        <h2 className="card-title">{role === "student" ? "Student Login" : "Employee Login"}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-content space-y-4">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              {role === "student" ? "Student Email" : "Employee Email"}
            </label>
            <input
              id="username"
              type="email"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
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

export default LoginForm
