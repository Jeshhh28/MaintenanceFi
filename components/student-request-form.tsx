"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { RequestStatus } from "@/lib/types"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StudentRequestFormProps {
  onSubmit: (data: Omit<RequestStatus, "id" | "status" | "submittedAt">) => void
}

export default function StudentRequestForm({ onSubmit }: StudentRequestFormProps) {
  const [regNo, setRegNo] = useState("")
  const [name, setName] = useState("")
  const [block, setBlock] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [type, setType] = useState("")
  const [listType, setListType] = useState("requisition")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!regNo || !name || !block || !roomNumber || !type || !description) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would handle file upload to your backend
      // For now, we'll just simulate it

      // Create request data
      const requestData = {
        regNo,
        name,
        blockRoom: `${block}-${roomNumber}`,
        type,
        listType,
        description,
        // In a real implementation, you would include the file URL after upload
      }

      onSubmit(requestData)

      // Reset form
      setRegNo("")
      setName("")
      setBlock("")
      setRoomNumber("")
      setType("")
      setListType("requisition")
      setDescription("")
      setFile(null)
    } catch (err) {
      setError("Failed to submit request. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="regNo">Registration Number *</Label>
          <Input id="regNo" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="block">Block *</Label>
          <Input id="block" value={block} onChange={(e) => setBlock(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number *</Label>
          <Input id="roomNumber" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type of Work *</Label>
        <Select value={type} onValueChange={setType} required>
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

      <div className="space-y-2">
        <Label>Request Category *</Label>
        <RadioGroup value={listType} onValueChange={setListType} className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="requisition" id="requisition" />
            <Label htmlFor="requisition">Requisition</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="suggestion" id="suggestion" />
            <Label htmlFor="suggestion">Suggestion</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="improvement" id="improvement" />
            <Label htmlFor="improvement">Improvement</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="feedback" id="feedback" />
            <Label htmlFor="feedback">Feedback</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Comments/Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proof">Proof (Optional)</Label>
        <Input
          id="proof"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0])
            }
          }}
        />
        <p className="text-sm text-gray-500">Accepted file types: PDF, DOC, DOCX, JPG, JPEG, PNG</p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  )
}

