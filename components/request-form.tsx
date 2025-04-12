"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export function RequestForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    block: "",
    roomNumber: "",
    workType: "",
    requestType: "suggestions",
    description: "",
    file: null as File | null,
  })

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserData(user)

        // Pre-fill form with user data if available
        if (user.profile) {
          setFormData((prev) => ({
            ...prev,
            regNo: user.profile.reg_no || "",
            name: user.profile.full_name || "",
            block: user.profile.block || "",
            roomNumber: user.profile.room_number || "",
          }))
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append("regNo", formData.regNo)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("block", formData.block)
      formDataToSend.append("roomNumber", formData.roomNumber)
      formDataToSend.append("workType", formData.workType)
      formDataToSend.append("requestType", formData.requestType)
      formDataToSend.append("description", formData.description)

      if (formData.file) {
        formDataToSend.append("file", formData.file)
      }

      // Send request to backend
      const response = await fetch("http://localhost:5000/api/student/requests", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request")
      }

      // Success message
      toast({
        title: "Request Submitted",
        description: "Your maintenance request has been submitted successfully.",
      })

      // Reset form
      setFormData({
        regNo: userData?.profile?.reg_no || "",
        name: userData?.profile?.full_name || "",
        block: userData?.profile?.block || "",
        roomNumber: userData?.profile?.room_number || "",
        workType: "",
        requestType: "suggestions",
        description: "",
        file: null,
      })

      // Reset file input
      const fileInput = document.getElementById("proof") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="regNo">Registration Number</Label>
          <Input
            id="regNo"
            name="regNo"
            value={formData.regNo}
            onChange={handleInputChange}
            placeholder="Enter your registration number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="block">Block</Label>
          <Input
            id="block"
            name="block"
            value={formData.block}
            onChange={handleInputChange}
            placeholder="Enter your block"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input
            id="roomNumber"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleInputChange}
            placeholder="Enter your room number"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workType">Type of Work</Label>
        <Select value={formData.workType} onValueChange={(value) => handleSelectChange("workType", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select type of work" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electrical">Electrical</SelectItem>
            <SelectItem value="plumbing">Plumbing</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="internet">Internet</SelectItem>
            <SelectItem value="laundry">Laundry</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Request Type</Label>
        <RadioGroup
          value={formData.requestType}
          onValueChange={(value) => handleSelectChange("requestType", value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="suggestions" id="suggestions" />
            <Label htmlFor="suggestions" className="cursor-pointer">
              Suggestions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="improvements" id="improvements" />
            <Label htmlFor="improvements" className="cursor-pointer">
              Improvements
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="feedbacks" id="feedbacks" />
            <Label htmlFor="feedbacks" className="cursor-pointer">
              Feedbacks
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="requisition" id="requisition" />
            <Label htmlFor="requisition" className="cursor-pointer">
              Requisition
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide details about your request"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proof">Proof (PDF, DOC, JPG)</Label>
        <Input
          id="proof"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">Upload a file as proof or additional information</p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  )
}
