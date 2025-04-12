"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RequestManagementList from "@/components/request-management-list";
import RequestAnalytics from "@/components/request-analytics";
import type { RequestStatus } from "@/lib/types";

export default function EmployeeDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [requests, setRequests] = useState<RequestStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const userType = localStorage.getItem("userType");
    if (userType !== "employee") {
      router.push("/login/employee");
    } else {
      fetchRequests(); // Fetch requests when the page loads
    }
  }, [router]);

  // 🔹 Fetch pending requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/get-requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Approve or Reject Requests
  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    const endpoint =
      status === "approved"
        ? `http://localhost:5000/api/approve-request/${id}`
        : `http://localhost:5000/api/reject-request/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: status === "approved" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to ${status} request`);

      // Remove from UI
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error(`❌ Error updating request status (${status}):`, error);
    }
  };

  // 🔹 Download Report (Excel or PDF)
  const handleDownloadReport = async (format: "excel" | "pdf") => {
    setDownloading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/download-report?format=${format}`);
      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Maintenance_Report.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error downloading report:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("employeeId");
    router.push("/");
  };

  if (!isClient) return null; // Prevent hydration errors

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Employee Maintenance Portal</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="pending-requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending-requests">Pending Requests</TabsTrigger>
            <TabsTrigger value="analytics">Request Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger> {/* 🔹 New Reports Tab */}
          </TabsList>

          <TabsContent value="pending-requests">
            <Card>
              <CardHeader>
                <CardTitle>Manage Maintenance Requests</CardTitle>
                <CardDescription>Review and respond to pending maintenance requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading requests...</p>
                ) : requests.length > 0 ? (
                  <RequestManagementList requests={requests} onUpdateStatus={handleUpdateStatus} />
                ) : (
                  <p>No pending requests</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Request Analytics</CardTitle>
                <CardDescription>View statistics and trends of maintenance requests</CardDescription>
              </CardHeader>
              <CardContent>
                <RequestAnalytics requests={requests} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 🔹 Reports Section */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Download maintenance reports in Excel or PDF format.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={() => handleDownloadReport("excel")} disabled={downloading}>
                    📊 Download Excel Report
                  </Button>
                  <Button onClick={() => handleDownloadReport("pdf")} disabled={downloading}>
                    📄 Download PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
