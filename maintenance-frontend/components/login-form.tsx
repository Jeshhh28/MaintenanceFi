"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LoginFormProps {
  role: string
}

export function LoginForm({ role }: LoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
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
          router.push("/student/dashboard")
        } else {
          router.push("/employee/dashboard")
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
    <Card className="shadow-md">
      <CardHeader>
        <Link href="/" className="flex items-center text-sm text-muted-foreground mb-2 hover:text-primary">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>
        <CardTitle>{role === "student" ? "Student Login" : "Employee Login"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{role === "student" ? "Registration Number" : "Employee ID"}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === "student" ? "Enter your reg number" : "Enter your employee ID"}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

