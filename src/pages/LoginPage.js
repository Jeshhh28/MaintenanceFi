"use client"
import { useParams, Link } from "react-router-dom"
import LoginForm from "../components/LoginForm"

function LoginPage() {
  const { role } = useParams()

  if (role !== "student" && role !== "employee") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">404 - Not Found</h1>
          <p className="mb-4">The page you're looking for doesn't exist.</p>
          <Link to="/">
            <button className="btn btn-primary">Go Home</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8">
          {role === "student" ? "Student Login" : "Employee Login"}
        </h1>
        <LoginForm role={role} />
      </div>
    </div>
  )
}

export default LoginPage
