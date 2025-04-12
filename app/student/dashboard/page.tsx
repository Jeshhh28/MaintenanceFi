import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequestForm } from "@/components/request-form"
import { RequestStatus } from "@/components/request-status"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Student Maintenance Portal</h1>
          <Link href="/">
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="new-request" className="space-y-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="new-request">New Request</TabsTrigger>
            <TabsTrigger value="request-status">Request Status</TabsTrigger>
          </TabsList>

          <TabsContent value="new-request" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Submit Maintenance Request</h2>
              <RequestForm />
            </div>
          </TabsContent>

          <TabsContent value="request-status" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Your Request Status</h2>
              <RequestStatus />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
