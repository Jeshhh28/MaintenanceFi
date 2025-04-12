"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

interface User {
  id: string
  name: string
  role: "student" | "admin"
  regNo?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, role: "student" | "admin") => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, role: "student" | "admin"): Promise<boolean> => {
    try {
      setLoading(true)

      // This is where you would make an API call to your backend
      // For now, we'll simulate a successful login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on role
      let userData: User

      if (role === "student") {
        userData = {
          id: "1",
          name: "Student User",
          role: "student",
          regNo: "S12345",
        }
      } else {
        userData = {
          id: "2",
          name: "Admin User",
          role: "admin",
        }
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

