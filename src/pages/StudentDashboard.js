"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RequestForm from "../components/RequestForm"
import RequestStatus from "../components/RequestStatus"
import supabase from "../supabaseClient"

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("new-request")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          navigate("/login/student")
          return
        }

        // Check if user is a student
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profileError || !profileData || profileData.role !== "student") {
          // Not a student, redirect to login
          await supabase.auth.signOut()
          navigate("/login/student")
          return
        }

        setUser(user)
      } catch (error) {
        console.error("Error checking user:", error)
        navigate("/login/student")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Student Maintenance Portal</h1>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            <span className="mr-2">←</span>
            Logout
          </button>
        </div>
      </header>

      <main className="container py-8">
        <div className="tabs space-y-6">
          <div className="tabs-list md:w-[400px]">
            <div
              className={`tab ${activeTab === "new-request" ? "active" : ""}`}
              onClick={() => setActiveTab("new-request")}
            >
              New Request
            </div>
            <div
              className={`tab ${activeTab === "request-status" ? "active" : ""}`}
              onClick={() => setActiveTab("request-status")}
            >
              Request Status
            </div>
          </div>

          <div className={`tab-content ${activeTab === "new-request" ? "active" : ""}`}>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Submit Maintenance Request</h2>
              <RequestForm />
            </div>
          </div>

          <div className={`tab-content ${activeTab === "request-status" ? "active" : ""}`}>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Your Request Status</h2>
              <RequestStatus />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
