import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequestManagement } from "@/components/request-management"
import { RequestAnalytics } from "@/components/request-analytics"
import { ReportGenerator } from "@/components/report-generator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, BarChart2, ClipboardList, FileText } from "lucide-react"

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Employee Maintenance Portal</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="requests" className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" />
              Manage Requests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Maintenance Requests</h2>
              <RequestManagement />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Request Analytics</h2>
              <RequestAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Generate Reports</h2>
              <ReportGenerator />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
