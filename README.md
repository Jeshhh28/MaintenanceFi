# Student Maintenance Requisition System

This project is a web-based application for students to register maintenance requests. It consists of a **React.js frontend** and an **Express.js backend with MySQL**.

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v18+) & npm
- MySQL database

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```

#### Frontend Dependencies
- `react` ^19.0.0
- `react-dom` ^19.0.0
- `react-router-dom` ^7.4.0
- `react-hook-form` ^7.54.2
- `axios` ^1.8.4
- `bootstrap` ^5.3.3

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd maintenance-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure database credentials:
   ```env
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```

#### Backend Dependencies
- `express` ^4.21.2
- `mysql2` ^3.14.0
- `dotenv` ^16.4.7
- `cors` ^2.8.5
- `body-parser` ^1.20.3
- `multer` ^1.4.5-lts.2
- `exceljs` ^4.4.0 (for Excel reports)
- `pdfkit` ^0.16.0 (for PDF generation)

## Database Setup
1. Create a MySQL database:
   ```sql
   CREATE DATABASE maintenance_db;
   ```
2. Import the provided SQL schema (if available) or create necessary tables.

## Running the Project
- Ensure both frontend and backend servers are running.
- Open the frontend in the browser at `http://localhost:3000`.
- Backend runs at `http://localhost:5000` (or configured port).

## Notes
- Make sure MySQL is running before starting the backend.
- Adjust CORS settings if required for cross-origin requests.

## Authors
Rohith
23BCB0017
Jeswanth G
23BDS0212
