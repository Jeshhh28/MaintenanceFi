"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { RequestStatus } from "@/lib/types"

interface RequestAnalyticsProps {
  requests: RequestStatus[]
}

export default function RequestAnalytics({ requests }: RequestAnalyticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mostRequestedType, setMostRequestedType] = useState<string>("")
  const [typeCount, setTypeCount] = useState<Record<string, number>>({})

  useEffect(() => {
    // Calculate most requested type
    const counts: Record<string, number> = {}
    requests.forEach((request) => {
      counts[request.type] = (counts[request.type] || 0) + 1
    })

    setTypeCount(counts)

    // Find the most requested type
    let maxType = ""
    let maxCount = 0

    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxType = type
        maxCount = count
      }
    })

    setMostRequestedType(maxType)

    // Draw chart
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        drawChart(ctx, counts)
      }
    }
  }, [requests])

  const drawChart = (ctx: CanvasRenderingContext2D, data: Record<string, number>) => {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Colors for different types
    const colors = {
      electrical: "#FFA500",
      plumbing: "#4682B4",
      cleaning: "#32CD32",
      internet: "#9370DB",
      laundry: "#FF6347",
      other: "#708090",
    }

    const entries = Object.entries(data)
    if (entries.length === 0) return

    const total = entries.reduce((sum, [_, count]) => sum + count, 0)
    let startAngle = 0

    // Draw pie chart
    entries.forEach(([type, count]) => {
      const sliceAngle = (count / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(width / 2, height / 2)
      ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 - 10, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      // @ts-ignore - TypeScript doesn't know about our color mapping
      ctx.fillStyle = colors[type] || "#CCCCCC"
      ctx.fill()

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = Math.min(width, height) / 2 - 40
      const labelX = width / 2 + Math.cos(labelAngle) * labelRadius
      const labelY = height / 2 + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = "#000000"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${type} (${count})`, labelX, labelY)

      startAngle += sliceAngle
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Most Requested Service</CardTitle>
          <CardDescription>The most common maintenance request type</CardDescription>
        </CardHeader>
        <CardContent>
          {mostRequestedType ? (
            <div className="text-center">
              <p className="text-3xl font-bold capitalize">{mostRequestedType}</p>
              <p className="text-gray-500 mt-2">{typeCount[mostRequestedType]} requests</p>
            </div>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Distribution</CardTitle>
          <CardDescription>Breakdown of maintenance requests by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <canvas ref={canvasRef} width={300} height={300} className="max-w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

