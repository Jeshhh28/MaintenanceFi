"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function StudentDashboard() {
  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [block, setBlock] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [workType, setWorkType] = useState("electrical");
  const [description, setDescription] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null); // State for file upload
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("regNo", regNo);
      formData.append("name", name);
      formData.append("block", block);
      formData.append("roomNo", roomNo);
      formData.append("workType", workType);
      formData.append("description", description);
      if (proofFile) {
        formData.append("proofFile", proofFile);

      }

      const res = await fetch("http://localhost:5000/api/submit-request", {
        method: "POST",
        body: formData, // Send as FormData (important for file uploads)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request submission failed");

      alert("✅ Request submitted successfully!");
      setRegNo("");
      setName("");
      setBlock("");
      setRoomNo("");
      setWorkType("electrical");
      setDescription("");
      setProofFile(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Submit Maintenance Request</CardTitle>
            <CardDescription>Fill out the form below to submit your request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration Number</Label>
                <Input id="regNo" type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Input id="block" type="text" value={block} onChange={(e) => setBlock(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNo">Room Number</Label>
                <Input id="roomNo" type="text" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workType">Type of Work</Label>
                <select
                  id="workType"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="internet">Internet</option>
                  <option value="laundry">Laundry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Describe the issue</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proof">Upload Proof (PDF, DOC, JPG)</Label>
                <Input id="proof" type="file" accept=".pdf, .doc, .jpg" onChange={handleFileChange} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
