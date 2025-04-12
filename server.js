// 🔹 Import Dependencies
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Ensure Upload Directory Exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// 🔹 Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Save files in "uploads/" directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// 🔹 Multer File Type Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('❌ Invalid file type. Only JPG, PNG, and PDF allowed!'), false);
    }
};

// 🔹 Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// 🔹 MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rohith@1031",
    database: "maintenance_system",
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL database");
    }
});

// 🔹 API Route: Submit Maintenance Request with File Upload
app.post("/api/submit-request", upload.single("proofFile"), (req, res) => {
    const { regNo, name, block, roomNo, workType, description } = req.body;
    const proofFile = req.file ? req.file.path : null;

    if (!regNo || !name || !block || !roomNo || !workType || !description) {
        return res.status(400).json({ error: "❌ All fields are required" });
    }

    const sql = `
        INSERT INTO maintenance_request (regNo, name, block, roomNo, workType, description, proofFile) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [regNo, name, block, roomNo, workType, description, proofFile], (err, result) => {
        if (err) {
            console.error("❌ Error inserting request:", err);
            return res.status(500).json({ error: "❌ Database error" });
        }
        res.json({ message: "✅ Request submitted successfully!", requestId: result.insertId });
    });
});

// 🔹 File Upload Route (Separate Endpoint)
app.post('/upload', upload.single('proofFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '❌ No file uploaded' });
    }
    res.json({ message: '✅ File uploaded successfully', filePath: req.file.path });
});

// 🔹 API Route: Get All Maintenance Requests
app.get("/api/get-requests", (req, res) => {
    const sql = "SELECT * FROM maintenance_request";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching requests:", err);
            return res.status(500).json({ error: "❌ Database error" });
        }
        res.json(results);
    });
});
// 🔹 API Route: Approve a Maintenance Request
app.post("/api/approve-request/:id", (req, res) => {
    const requestId = req.params.id;

    // Fetch the request details from maintenance_request
    const fetchSql = "SELECT * FROM maintenance_request WHERE id = ?";
    
    db.query(fetchSql, [requestId], (err, results) => {
        if (err) {
            console.error("❌ Error fetching request:", err);
            return res.status(500).json({ error: "❌ Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "❌ Request not found" });
        }

        const request = results[0];

        // Insert into approved_requests table
        const insertSql = `
            INSERT INTO approved_requests (workType, name, regNo, block, roomNo, description, submittedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertSql, [request.workType, request.name, request.regNo, request.block, request.roomNo, request.description, request.created_at], (err) => {
            if (err) {
                console.error("❌ Error approving request:", err);
                return res.status(500).json({ error: "❌ Database error" });
            }

            // Delete from maintenance_request table after approval
            const deleteSql = "DELETE FROM maintenance_request WHERE id = ?";
            db.query(deleteSql, [requestId], (err) => {
                if (err) {
                    console.error("❌ Error deleting request:", err);
                    return res.status(500).json({ error: "❌ Database error" });
                }

                res.json({ message: "✅ Request approved successfully!" });
            });
        });
    });
});

// 🔹 API Route: Reject a Maintenance Request
app.delete("/api/reject-request/:id", (req, res) => {
    const requestId = req.params.id;

    const deleteSql = "DELETE FROM maintenance_request WHERE id = ?";
    
    db.query(deleteSql, [requestId], (err, result) => {
        if (err) {
            console.error("❌ Error deleting request:", err);
            return res.status(500).json({ error: "❌ Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Request not found" });
        }

        res.json({ message: "✅ Request rejected and deleted successfully!" });
    });
});

// 🔹 Report Generation API
app.get("/api/download-report", async (req, res) => {
    const format = req.query.format; // Get format (excel or pdf)
    
    if (!["excel", "pdf"].includes(format)) {
        return res.status(400).json({ error: "❌ Invalid format. Choose 'excel' or 'pdf'." });
    }

    const sql = "SELECT * FROM approved_requests";
    db.query(sql, async (err, results) => {
        if (err) {
            console.error("❌ Error fetching data for report:", err);
            return res.status(500).json({ error: "❌ Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "❌ No approved requests found." });
        }

        // 🔹 Generate Excel Report
        if (format === "excel") {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Approved Requests");

            // Headers
            worksheet.addRow([
                "ID", "Work Type", "Name", "Reg No", "Block", "Room No", "Description", "Submitted At", "Approved At"
            ]);

            // Data Rows
            results.forEach((row) => {
                worksheet.addRow([
                    row.id, row.workType, row.name, row.regNo, row.block, row.roomNo, row.description, row.submittedAt, row.approvedAt
                ]);
            });

            res.setHeader("Content-Disposition", "attachment; filename=Maintenance_Report.xlsx");
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            
            return workbook.xlsx.write(res).then(() => res.end());
        }

        // 🔹 Generate PDF Report
        if (format === "pdf") {
            const doc = new PDFDocument();
            const filePath = path.join(__dirname, "reports", "Maintenance_Report.pdf");

            // Ensure reports directory exists
            if (!fs.existsSync("reports")) fs.mkdirSync("reports");

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            doc.fontSize(16).text("Maintenance Report", { align: "center" }).moveDown(2);

            results.forEach((row) => {
                doc
                    .fontSize(12)
                    .text(`ID: ${row.id}`, { bold: true })
                    .text(`Work Type: ${row.workType}`)
                    .text(`Name: ${row.name}`)
                    .text(`Reg No: ${row.regNo}`)
                    .text(`Block: ${row.block}`)
                    .text(`Room No: ${row.roomNo}`)
                    .text(`Description: ${row.description}`)
                    .text(`Submitted At: ${row.submittedAt}`)
                    .text(`Approved At: ${row.approvedAt}`)
                    .moveDown(1);
            });

            doc.end();
            stream.on("finish", () => res.download(filePath));
        }
    });
});



// 🔹 Start Server
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
