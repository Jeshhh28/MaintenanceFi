require('dotenv').config();
const express = require('express');  // Import Express
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// API Endpoint: Submit Maintenance Request
app.post('/submit-request', upload.single('proof'), (req, res) => {
    const { reg_no, name, block, room_no, work_type, feedback, comments } = req.body;
    const proofFilePath = req.file ? req.file.path : null;

    const sql = `INSERT INTO maintenance_requests (reg_no, name, block, room_no, work_type, feedback, comments, proof) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [reg_no, name, block, room_no, work_type, feedback, comments, proofFilePath];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Request submitted successfully' });
    });
});

// API Endpoint: Fetch All Requests
app.get('/get-requests', (req, res) => {
    const sql = `SELECT * FROM maintenance_requests`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// API Endpoint: Generate Excel Report
app.get('/generate-excel', (req, res) => {
    const sql = "SELECT * FROM maintenance_requests";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Maintenance Requests');

        worksheet.columns = [
            { header: 'Reg No', key: 'reg_no' },
            { header: 'Name', key: 'name' },
            { header: 'Block', key: 'block' },
            { header: 'Room No', key: 'room_no' },
            { header: 'Work Type', key: 'work_type' },
            { header: 'Feedback', key: 'feedback' },
            { header: 'Comments', key: 'comments' },
            { header: 'Proof', key: 'proof' }
        ];

        worksheet.addRows(results);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=maintenance_requests.xlsx');

        workbook.xlsx.write(res)
            .then(() => res.end())
            .catch(err => res.status(500).json({ error: err.message }));
    });
});

// API Endpoint: Generate PDF Report
app.get('/generate-pdf', (req, res) => {
    const sql = "SELECT * FROM maintenance_requests";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const doc = new PDFDocument();
        const filePath = path.join(__dirname, 'maintenance_requests.pdf');
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        doc.fontSize(16).text('Maintenance Requests Report', { align: 'center' });
        doc.moveDown();

        results.forEach((row, index) => {
            doc.text(`Request ${index + 1}:`);
            doc.text(`Reg No: ${row.reg_no}`);
            doc.text(`Name: ${row.name}`);
            doc.text(`Block: ${row.block}`);
            doc.text(`Room No: ${row.room_no}`);
            doc.text(`Work Type: ${row.work_type}`);
            doc.text(`Feedback: ${row.feedback}`);
            doc.text(`Comments: ${row.comments}`);
            doc.text('-------------------------------------');
        });

        doc.end();

        writeStream.on('finish', () => {
            res.download(filePath, 'maintenance_requests.pdf');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
