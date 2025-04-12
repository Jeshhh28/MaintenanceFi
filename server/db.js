const mysql = require("mysql2/promise")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")

dotenv.config()

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "maintenance_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Database connection successful")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// User authentication
async function authenticateUser(email, password) {
  try {
    const [rows] = await pool.execute("SELECT id, email, password_hash, role FROM users WHERE email = ?", [email])

    if (rows.length === 0) {
      return { success: false, message: "User not found" }
    }

    const user = rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return { success: false, message: "Invalid password" }
    }

    // Get profile information based on role
    let profile
    if (user.role === "student") {
      const [profileRows] = await pool.execute("SELECT * FROM student_profiles WHERE user_id = ?", [user.id])
      profile = profileRows[0] || {}
    } else {
      const [profileRows] = await pool.execute("SELECT * FROM employee_profiles WHERE user_id = ?", [user.id])
      profile = profileRows[0] || {}
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile,
      },
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "Authentication failed" }
  }
}

// Get maintenance requests for a student
async function getStudentRequests(studentId) {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM maintenance_requests WHERE student_id = ? ORDER BY created_at DESC",
      [studentId],
    )
    return { success: true, data: rows }
  } catch (error) {
    console.error("Error fetching student requests:", error)
    return { success: false, message: "Failed to fetch requests" }
  }
}

// Get all maintenance requests (for employees)
async function getAllRequests() {
  try {
    const [rows] = await pool.execute("SELECT * FROM maintenance_requests ORDER BY created_at DESC")
    return { success: true, data: rows }
  } catch (error) {
    console.error("Error fetching all requests:", error)
    return { success: false, message: "Failed to fetch requests" }
  }
}

// Create a new maintenance request
async function createRequest(requestData) {
  try {
    // Generate a unique request number
    const requestNumber =
      "REQ-" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")

    const [result] = await pool.execute(
      `INSERT INTO maintenance_requests 
      (request_number, student_id, reg_no, name, block, room_number, work_type, request_type, description, file_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        requestNumber,
        requestData.studentId,
        requestData.regNo,
        requestData.name,
        requestData.block,
        requestData.roomNumber,
        requestData.workType,
        requestData.requestType,
        requestData.description,
        requestData.filePath || null,
      ],
    )

    return {
      success: true,
      message: "Request created successfully",
      requestId: result.insertId,
      requestNumber,
    }
  } catch (error) {
    console.error("Error creating request:", error)
    return { success: false, message: "Failed to create request" }
  }
}

// Update a maintenance request status
async function updateRequestStatus(requestId, status, comments, employeeId) {
  try {
    const [result] = await pool.execute(
      `UPDATE maintenance_requests 
      SET status = ?, response_comments = ?, handled_by = ? 
      WHERE id = ?`,
      [status, comments, employeeId, requestId],
    )

    if (result.affectedRows === 0) {
      return { success: false, message: "Request not found" }
    }

    return { success: true, message: `Request ${status} successfully` }
  } catch (error) {
    console.error("Error updating request:", error)
    return { success: false, message: "Failed to update request" }
  }
}

// Get analytics data for reports
async function getAnalyticsData() {
  try {
    // Get requests by type
    const [typeData] = await pool.execute(
      `SELECT work_type as type, COUNT(*) as count 
      FROM maintenance_requests 
      GROUP BY work_type 
      ORDER BY count DESC`,
    )

    // Get requests by status
    const [statusData] = await pool.execute(
      `SELECT status, COUNT(*) as count 
      FROM maintenance_requests 
      GROUP BY status 
      ORDER BY count DESC`,
    )

    // Get requests by block
    const [blockData] = await pool.execute(
      `SELECT block, COUNT(*) as count 
      FROM maintenance_requests 
      GROUP BY block 
      ORDER BY count DESC`,
    )

    // Get monthly trends
    const [monthlyData] = await pool.execute(
      `SELECT DATE_FORMAT(created_at, '%b') as month, COUNT(*) as count 
      FROM maintenance_requests 
      GROUP BY month 
      ORDER BY MONTH(created_at) DESC 
      LIMIT 6`,
    )

    return {
      success: true,
      data: {
        requestsByType: typeData,
        requestsByStatus: statusData,
        requestsByBlock: blockData,
        recentTrends: monthlyData,
      },
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return { success: false, message: "Failed to fetch analytics data" }
  }
}

// Generate detailed report data
async function getReportData(filters = {}) {
  try {
    let query = `
      SELECT 
        r.id, r.request_number, r.reg_no, r.name, r.block, r.room_number, 
        r.work_type, r.request_type, r.description, r.status, r.response_comments,
        r.created_at, r.updated_at,
        e.full_name as handled_by_name
      FROM maintenance_requests r
      LEFT JOIN users u ON r.handled_by = u.id
      LEFT JOIN employee_profiles e ON u.id = e.user_id
      WHERE 1=1
    `

    const queryParams = []

    // Add filters if provided
    if (filters.status && filters.status !== "all") {
      query += " AND r.status = ?"
      queryParams.push(filters.status)
    }

    if (filters.workType && filters.workType !== "all") {
      query += " AND r.work_type = ?"
      queryParams.push(filters.workType)
    }

    if (filters.block && filters.block !== "all") {
      query += " AND r.block = ?"
      queryParams.push(filters.block)
    }

    if (filters.startDate && filters.endDate) {
      query += " AND r.created_at BETWEEN ? AND ?"
      queryParams.push(filters.startDate, filters.endDate)
    }

    query += " ORDER BY r.created_at DESC"

    const [rows] = await pool.execute(query, queryParams)

    return { success: true, data: rows }
  } catch (error) {
    console.error("Error generating report:", error)
    return { success: false, message: "Failed to generate report" }
  }
}

// Register a new user
async function registerUser(userData) {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(userData.password, 10)

    // Begin transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Insert user
      const [userResult] = await connection.execute("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)", [
        userData.email,
        passwordHash,
        userData.role,
      ])

      const userId = userResult.insertId

      // Insert profile based on role
      if (userData.role === "student") {
        await connection.execute(
          "INSERT INTO student_profiles (user_id, reg_no, full_name, block, room_number) VALUES (?, ?, ?, ?, ?)",
          [userId, userData.regNo, userData.fullName, userData.block || null, userData.roomNumber || null],
        )
      } else {
        await connection.execute(
          "INSERT INTO employee_profiles (user_id, employee_id, full_name, department) VALUES (?, ?, ?, ?)",
          [userId, userData.employeeId, userData.fullName, userData.department || null],
        )
      }

      // Commit transaction
      await connection.commit()
      connection.release()

      return { success: true, message: "User registered successfully", userId }
    } catch (error) {
      // Rollback on error
      await connection.rollback()
      connection.release()
      throw error
    }
  } catch (error) {
    console.error("Error registering user:", error)
    return {
      success: false,
      message: error.code === "ER_DUP_ENTRY" ? "Email already exists" : "Failed to register user",
    }
  }
}

module.exports = {
  pool,
  testConnection,
  authenticateUser,
  getStudentRequests,
  getAllRequests,
  createRequest,
  updateRequestStatus,
  getAnalyticsData,
  getReportData,
  registerUser,
}
