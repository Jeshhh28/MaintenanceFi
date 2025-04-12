"use client"

import { useState } from "react"
import supabase from "../supabaseClient"

function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    block: "",
    roomNumber: "",
    workType: "",
    listType: "suggestions",
    comments: "",
    file: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("You must be logged in to submit a request")
      }

      // First, upload the file if it exists
      let fileUrl = null
      if (formData.file) {
        const fileExt = formData.file.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        // Upload file to Supabase Storage
        const { data: fileData, error: fileError } = await supabase.storage
          .from("proof-uploads")
          .upload(filePath, formData.file, {
            cacheControl: "3600",
            upsert: false,
            contentType: formData.file.type,
          })

        if (fileError) {
          console.error("File upload error:", fileError)
          throw new Error(`File upload failed: ${fileError.message}`)
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage.from("proof-uploads").getPublicUrl(filePath)

        fileUrl = urlData.publicUrl
      }

      // Now insert the request data into the database
      const { data, error } = await supabase.from("requests").insert([
        {
          user_id: user.id,
          reg_no: formData.regNo,
          name: formData.name,
          block: formData.block,
          room_number: formData.roomNumber,
          work_type: formData.workType,
          list_type: formData.listType,
          comments: formData.comments,
          file_url: fileUrl,
          status: "pending",
        },
      ])

      if (error) {
        throw new Error(`Request submission failed: ${error.message}`)
      }

      // Success message
      setSuccessMessage("Your maintenance request has been submitted successfully.")

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
      const fileInput = document.getElementById("proof")
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Form submission error:", error)
      setErrorMessage(error.message || "There was an error submitting your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && <div className="bg-green-500 text-white p-4 rounded-lg mb-4">{successMessage}</div>}

      {errorMessage && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{errorMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="regNo" className="form-label">
            Registration Number
          </label>
          <input
            id="regNo"
            name="regNo"
            className="form-input"
            value={formData.regNo}
            onChange={handleInputChange}
            placeholder="Enter your registration number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="block" className="form-label">
            Block
          </label>
          <input
            id="block"
            name="block"
            className="form-input"
            value={formData.block}
            onChange={handleInputChange}
            placeholder="Enter your block"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="roomNumber" className="form-label">
            Room Number
          </label>
          <input
            id="roomNumber"
            name="roomNumber"
            className="form-input"
            value={formData.roomNumber}
            onChange={handleInputChange}
            placeholder="Enter your room number"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="workType" className="form-label">
          Type of Work
        </label>
        <select
          id="workType"
          name="workType"
          className="form-select"
          value={formData.workType}
          onChange={handleInputChange}
          required
        >
          <option value="">Select type of work</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="cleaning">Cleaning</option>
          <option value="internet">Internet</option>
          <option value="laundry">Laundry</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Request Type</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="suggestions"
              name="listType"
              value="suggestions"
              checked={formData.listType === "suggestions"}
              onChange={handleInputChange}
            />
            <label htmlFor="suggestions" className="cursor-pointer">
              Suggestions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="improvements"
              name="listType"
              value="improvements"
              checked={formData.listType === "improvements"}
              onChange={handleInputChange}
            />
            <label htmlFor="improvements" className="cursor-pointer">
              Improvements
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="feedbacks"
              name="listType"
              value="feedbacks"
              checked={formData.listType === "feedbacks"}
              onChange={handleInputChange}
            />
            <label htmlFor="feedbacks" className="cursor-pointer">
              Feedbacks
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="requisition"
              name="listType"
              value="requisition"
              checked={formData.listType === "requisition"}
              onChange={handleInputChange}
            />
            <label htmlFor="requisition" className="cursor-pointer">
              Requisition
            </label>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="comments" className="form-label">
          Comments
        </label>
        <textarea
          id="comments"
          name="comments"
          className="form-textarea"
          value={formData.comments}
          onChange={handleInputChange}
          placeholder="Provide details about your request"
          rows={4}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="proof" className="form-label">
          Proof (PDF, DOC, JPG)
        </label>
        <input
          id="proof"
          type="file"
          className="form-input"
          accept=".pdf,.doc,.docx,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        <p className="text-sm text-muted mt-1">Upload a file as proof or additional information</p>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  )
}

export default RequestForm
