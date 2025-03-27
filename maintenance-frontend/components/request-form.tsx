"use client"

import type React from "react"

import { useState } from "react"
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
  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    block: "",
    roomNumber: "",
    workType: "",
    listType: "suggestions",
    comments: "",
    file: null as File | null,
  })

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
      // This would be replaced with actual API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success message
      toast({
        title: "Request Submitted",
        description: "Your maintenance request has been submitted successfully.",
      })

      // Reset form
      setFormData({
        regNo: "",
        name: "",
        block: "",
        roomNumber: "",
        workType: "",
        listType: "suggestions",
        comments: "",
        file: null,
      })

      // Reset file input
      const fileInput = document.getElementById("proof") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
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
          value={formData.listType}
          onValueChange={(value) => handleSelectChange("listType", value)}
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
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          name="comments"
          value={formData.comments}
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
          accept=".pdf,.doc,.docx,.jpg,.jpeg"
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

