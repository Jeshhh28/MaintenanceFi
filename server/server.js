const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const db = require("./db")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const ExcelJS = require("exceljs")
const PDFDocument = require("pdfkit")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed."))
    }
  },
})

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token is required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

// Routes
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" })
  }

  const result = await db.authenticateUser(email, password)

  if (!result.success) {
    return res.status(401).json(result)
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )

  res.json({
    success: true,
    token,
    user: result.user,
  })
})

// Registration route
app.post("/api/register", async (req, res) => {
  const { email, password, role, fullName, regNo, employeeId, block, roomNumber, department } = req.body

  if (!email || !password || !role || !fullName) {
    return res.status(400).json({ success: false, message: "Required fields are missing" })
  }

  if (role === "student" && !regNo) {
    return res.status(400).json({ success: false, message: "Registration number is required for students" })
  }

  if (role === "employee" && !employeeId) {
    return res.status(400).json({ success: false, message: "Employee ID is required for employees" })
  }

  const result = await db.registerUser({
    email,
    password,
    role,
    fullName,
    regNo,
    employeeId,
    block,
    roomNumber,
    department,
  })

  res.status(result.success ? 201 : 400).json(result)
})

// Student routes
app.get("/api/student/requests", authenticateToken, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const result = await db.getStudentRequests(req.user.id)
  res.json(result)
})

app.post("/api/student/requests", authenticateToken, upload.single("file"), async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const { regNo, name, block, roomNumber, workType, requestType, description } = req.body

  if (!regNo || !name || !block || !roomNumber || !workType || !requestType || !description) {
    return res.status(400).json({ success: false, message: "All fields are required" })
  }

  const filePath = req.file ? `/uploads/${req.file.filename}` : null

  const result = await db.createRequest({
    studentId: req.user.id,
    regNo,
    name,
    block,
    roomNumber,
    workType,
    requestType,
    description,
    filePath,
  })

  res.json(result)
})

// Employee routes
app.get("/api/employee/requests", authenticateToken, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const result = await db.getAllRequests()
  res.json(result)
})

app.put("/api/employee/requests/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const { id } = req.params
  const { status, comments } = req.body

  if (!status || !comments) {
    return res.status(400).json({ success: false, message: "Status and comments are required" })
  }

  const result = await db.updateRequestStatus(id, status, comments, req.user.id)
  res.json(result)
})

app.get("/api/employee/analytics", authenticateToken, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const result = await db.getAnalyticsData()
  res.json(result)
})

// Report generation routes
app.get("/api/employee/reports", authenticateToken, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const { status, workType, block, startDate, endDate } = req.query

  const filters = {}
  if (status) filters.status = status
  if (workType) filters.workType = workType
  if (block) filters.block = block
  if (startDate && endDate) {
    filters.startDate = startDate
    filters.endDate = endDate
  }

  const result = await db.getReportData(filters)
  res.json(result)
})

app.get("/api/employee/reports/excel", authenticateToken, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const { status, workType, block, startDate, endDate } = req.query

  const filters = {}
  if (status) filters.status = status
  if (workType) filters.workType = workType
  if (block) filters.block = block
  if (startDate && endDate) {
    filters.startDate = startDate
    filters.endDate = endDate
  }

  const result = await db.getReportData(filters)

  if (!result.success) {
    return res.status(500).json(result)
  }

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Maintenance Requests")

  // Add headers
  worksheet.columns = [
    { header: "Request #", key: "request_number", width: 15 },
    { header: "Reg No", key: "reg_no", width: 15 },
    { header: "Name", key: "name", width: 20 },
    { header: "Block", key: "block", width: 10 },
    { header: "Room", key: "room_number", width: 10 },
    { header: "Type", key: "work_type", width: 15 },
    { header: "Description", key: "description", width: 30 },
    { header: "Status", key: "status", width: 15 },
    { header: "Comments", key: "response_comments", width: 30 },
    { header: "Created", key: "created_at", width: 20 },
    { header: "Updated", key: "updated_at", width: 20 },
    { header: "Handled By", key: "handled_by_name", width: 20 },
  ]

  // Add rows
  worksheet.addRows(result.data)

  // Format dates
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      if (row.getCell("created_at").value) {
        row.getCell("created_at").value = new Date(row.getCell("created_at").value).toLocaleString()
      }
      if (row.getCell("updated_at").value) {
        row.getCell("updated_at").value = new Date(row.getCell("updated_at").value).toLocaleString()
      }
    }
  })

  // Set response headers
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  res.setHeader("Content-Disposition", "attachment; filename=maintenance_requests_report.xlsx")

  // Write to response
  await workbook.xlsx.write(res)
})

app.get("/api/employee/reports/pdf", authenticateToken, async (req, res) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({ success: false, message: "Access denied" })
  }

  const { status, workType, block, startDate, endDate } = req.query

  const filters = {}
  if (status) filters.status = status
  if (workType) filters.workType = workType
  if (block) filters.block = block
  if (startDate && endDate) {
    filters.startDate = startDate
    filters.endDate = endDate
  }

  const result = await db.getReportData(filters)

  if (!result.success) {
    return res.status(500).json(result)
  }

  // Create PDF document
  const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" })

  // Set response headers
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=maintenance_requests_report.pdf")

  // Pipe PDF to response
  doc.pipe(res)

  // Add title
  doc.fontSize(16).text("Maintenance Requests Report", { align: "center" })
  doc.moveDown()

  // Add filters if any
  if (Object.keys(filters).length > 0) {
    doc.fontSize(10).text("Filters:", { underline: true })
    if (filters.status) doc.text(`Status: ${filters.status}`)
    if (filters.workType) doc.text(`Work Type: ${filters.workType}`)
    if (filters.block) doc.text(`Block: ${filters.block}`)
    if (filters.startDate && filters.endDate) {
      doc.text(
        `Date Range: ${new Date(filters.startDate).toLocaleDateString()} to ${new Date(filters.endDate).toLocaleDateString()}`,
      )
    }
    doc.moveDown()
  }

  // Add date
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" })
  doc.moveDown()

  // Define table
  const table = {
    headers: ["Request #", "Name", "Block/Room", "Type", "Status", "Created", "Comments"],
    rows: [],
  }

  // Add data rows
  result.data.forEach((request) => {
    table.rows.push([
      request.request_number,
      `${request.name} (${request.reg_no})`,
      `${request.block}/${request.room_number}`,
      request.work_type,
      request.status,
      new Date(request.created_at).toLocaleDateString(),
      request.response_comments || "-",
    ])
  })

  // Draw table headers
  const columnWidth = doc.page.width / table.headers.length
  let y = doc.y

  // Draw header background
  doc
    .fillColor("#f0f0f0")
    .rect(30, y, doc.page.width - 60, 20)
    .fill()
  doc.fillColor("#000000")

  // Draw header text
  table.headers.forEach((header, i) => {
    doc.fontSize(10).text(header, 30 + i * columnWidth, y + 5, { width: columnWidth, align: "center" })
  })

  y += 20

  // Draw rows
  table.rows.forEach((row, rowIndex) => {
    // Check if we need a new page
    if (y > doc.page.height - 50) {
      doc.addPage()
      y = 50
    }

    // Draw row background (alternating)
    if (rowIndex % 2 === 0) {
      doc
        .fillColor("#f9f9f9")
        .rect(30, y, doc.page.width - 60, 20)
        .fill()
      doc.fillColor("#000000")
    }

    // Draw row text
    row.forEach((cell, i) => {
      doc
        .fontSize(8)
        .text(cell.toString(), 30 + i * columnWidth, y + 5, { width: columnWidth, align: "center", ellipsis: true })
    })

    y += 20
  })

  // Add summary
  doc.moveDown(2)
  doc.fontSize(10).text(`Total Requests: ${result.data.length}`, { align: "right" })

  // Finalize PDF
  doc.end()
})

// Start server
app.listen(PORT, async () => {
  const connected = await db.testConnection()
  if (connected) {
    console.log(`Server running on port ${PORT}`)
  } else {
    console.error("Server started but database connection failed")
  }
})
