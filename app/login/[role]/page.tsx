import { LoginForm } from "@/components/login-form"
import { notFound } from "next/navigation"

export default function LoginPage({ params }: { params: { role: string } }) {
  const { role } = params

  if (role !== "student" && role !== "employee") {
    notFound()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8">
          {role === "student" ? "Student Login" : "Employee Login"}
        </h1>
        <LoginForm role={role} />
      </div>
    </div>
  )
}
