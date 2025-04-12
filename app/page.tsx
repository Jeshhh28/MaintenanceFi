import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Maintenance Requisition System</CardTitle>
            <CardDescription>Login to submit or manage maintenance requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Link href="/login/student" className="w-full">
                <Button className="w-full" size="lg">
                  Student Login
                </Button>
              </Link>
              <Link href="/login/employee" className="w-full">
                <Button className="w-full" variant="outline" size="lg">
                  Employee Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

