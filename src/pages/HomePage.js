import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Campus Maintenance Requisition System</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card shadow-md">
            <div className="card-header">
              <h2 className="card-title">Student Login</h2>
              <p className="card-description">Submit and track your maintenance requests</p>
            </div>
            <div className="card-content">
              <p className="mb-4">Access your student dashboard to:</p>
              <ul className="list-disc space-y-1 mb-6">
                <li>Submit new maintenance requests</li>
                <li>Track status of existing requests</li>
                <li>View request history</li>
              </ul>
              <Link to="/login/student" className="block">
                <button className="btn btn-primary w-full">
                  Student Login
                  <span className="ml-2">→</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="card shadow-md">
            <div className="card-header">
              <h2 className="card-title">Employee Login</h2>
              <p className="card-description">Manage and respond to maintenance requests</p>
            </div>
            <div className="card-content">
              <p className="mb-4">Access your employee dashboard to:</p>
              <ul className="list-disc space-y-1 mb-6">
                <li>Review pending maintenance requests</li>
                <li>Accept or deny requests</li>
                <li>View analytics on request types</li>
              </ul>
              <Link to="/login/employee" className="block">
                <button className="btn btn-primary w-full">
                  Employee Login
                  <span className="ml-2">→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
