"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, FileSpreadsheet, Download, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ReportGenerator() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    workType: "",
    block: "",
    startDate: "",
    endDate: "",
  })

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const generateExcelReport = async () => {
    try {
      setIsGenerating(true)

      // Build query parameters
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append("status", filters.status)
      if (filters.workType) queryParams.append("workType", filters.workType)
      if (filters.block) queryParams.append("block", filters.block)
      if (filters.startDate) queryParams.append("startDate", filters.startDate)
      if (filters.endDate) queryParams.append("endDate", filters.endDate)

      // Get the token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Create a link to download the file
      const link = document.createElement("a")
      link.href = `http://localhost:5000/api/employee/reports/excel?${queryParams.toString()}`
      link.setAttribute("download", "maintenance_requests_report.xlsx")

      // Add authorization header via a fetch request
      const response = await fetch(link.href, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      // Convert response to blob
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      link.href = url

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Report Generated",
        description: "Excel report has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error generating Excel report:", error)
      toast({
        title: "Report Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePdfReport = async () => {
    try {
      setIsGenerating(true)

      // Build query parameters
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append("status", filters.status)
      if (filters.workType) queryParams.append("workType", filters.workType)
      if (filters.block) queryParams.append("block", filters.block)
      if (filters.startDate) queryParams.append("startDate", filters.startDate)
      if (filters.endDate) queryParams.append("endDate", filters.endDate)

      // Get the token from localStorage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Create a link to download the file
      const link = document.createElement("a")
      link.href = `http://localhost:5000/api/employee/reports/pdf?${queryParams.toString()}`
      link.setAttribute("download", "maintenance_requests_report.pdf")

      // Add authorization header via a fetch request
      const response = await fetch(link.href, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      // Convert response to blob
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      link.href = url

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Report Generated",
        description: "PDF report has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error generating PDF report:", error)
      toast({
        title: "Report Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workType">Work Type</Label>
              <Select value={filters.workType} onValueChange={(value) => handleFilterChange("workType", value)}>
                <SelectTrigger id="workType">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
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
              <Label htmlFor="block">Block</Label>
              <Select value={filters.block} onValueChange={(value) => handleFilterChange("block", value)}>
                <SelectTrigger id="block">
                  <SelectValue placeholder="All Blocks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blocks</SelectItem>
                  <SelectItem value="A">Block A</SelectItem>
                  <SelectItem value="B">Block B</SelectItem>
                  <SelectItem value="C">Block C</SelectItem>
                  <SelectItem value="D">Block D</SelectItem>
                  <SelectItem value="E">Block E</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="excel" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="excel">Excel Report</TabsTrigger>
              <TabsTrigger value="pdf">PDF Report</TabsTrigger>
            </TabsList>
            <TabsContent value="excel" className="pt-4">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Excel Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download a detailed spreadsheet with all maintenance requests data
                  </p>
                </div>
                <Button
                  onClick={generateExcelReport}
                  disabled={isGenerating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isGenerating ? "Generating..." : "Download Excel Report"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="pdf" className="pt-4">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">PDF Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download a formatted PDF document with maintenance requests summary
                  </p>
                </div>
                <Button onClick={generatePdfReport} disabled={isGenerating} className="bg-red-600 hover:bg-red-700">
                  {isGenerating ? "Generating..." : "Download PDF Report"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
