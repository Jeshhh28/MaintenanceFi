"use client"

import React from "react"

function RequestForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [formData, setFormData] = React.useState({
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
      // This would be replaced with actual API call to your backend
      // Example of how to connect to your backend:
      /*
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'file' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'file') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('your-backend-url/api/requests', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const data = await response.json();
      */

      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

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
      setErrorMessage("There was an error submitting your request. Please try again.")
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
