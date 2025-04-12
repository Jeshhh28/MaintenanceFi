import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Campus Maintenance Requisition System</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Student Login</CardTitle>
              <CardDescription>Submit and track your maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access your student dashboard to:</p>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                <li>Submit new maintenance requests</li>
                <li>Track status of existing requests</li>
                <li>View request history</li>
              </ul>
              <Link href="/login/student" className="block">
                <Button className="w-full">
                  Student Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Employee Login</CardTitle>
              <CardDescription>Manage and respond to maintenance requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access your employee dashboard to:</p>
              <ul className="list-disc pl-5 mb-6 space-y-1">
                <li>Review pending maintenance requests</li>
                <li>Accept or deny requests</li>
                <li>View analytics on request types</li>
              </ul>
              <Link href="/login/employee" className="block">
                <Button className="w-full">
                  Employee Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
