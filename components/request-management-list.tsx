"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { RequestStatus } from "@/lib/types"
import { CheckCircle, XCircle } from "lucide-react"

interface RequestManagementListProps {
  requests: RequestStatus[]
  onUpdateStatus: (id: string, status: "approved" | "rejected") => Promise<void>  // ✅ Updated to handle async function
}

export default function RequestManagementList({ requests, onUpdateStatus }: RequestManagementListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)  // ✅ Track loading state per request
  const [error, setError] = useState<string | null>(null)  // ✅ Track errors

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No pending requests found.</p>
      </div>
    )
  }

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    setLoadingId(id)  // ✅ Set loading state for the current request
    setError(null)  // ✅ Reset errors before request

    try {
      await onUpdateStatus(id, status)  // ✅ Call the async function
    } catch (err) {
      console.error("Failed to update status:", err)
      setError("Failed to update request status. Please try again.")
    } finally {
      setLoadingId(null)  // ✅ Reset loading state after completion
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>  // ✅ Show error if exists
      )}

      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              <span className="capitalize">{request.type} Request</span>
              <span className="text-sm text-gray-500">{new Date(request.submittedAt).toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p>
                  {request.name} ({request.regNo})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{request.blockRoom}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1">{request.description}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => handleStatusUpdate(request.id, "rejected")}
              disabled={loadingId === request.id}  // ✅ Disable while updating
            >
              <XCircle className="mr-2 h-4 w-4" />
              {loadingId === request.id ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => handleStatusUpdate(request.id, "approved")}
              disabled={loadingId === request.id}  // ✅ Disable while updating
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {loadingId === request.id ? "Approving..." : "Approve"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
