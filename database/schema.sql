-- Database schema for Campus Maintenance Requisition System

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'employee') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reg_no VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  block VARCHAR(50),
  room_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Employee profiles
CREATE TABLE IF NOT EXISTS employee_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Maintenance requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_number VARCHAR(20) NOT NULL UNIQUE,
  student_id INT NOT NULL,
  reg_no VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  block VARCHAR(50) NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  work_type ENUM('electrical', 'plumbing', 'cleaning', 'internet', 'laundry', 'other') NOT NULL,
  request_type ENUM('suggestions', 'improvements', 'feedbacks', 'requisition') NOT NULL,
  description TEXT NOT NULL,
  file_path VARCHAR(255),
  status ENUM('pending', 'approved', 'completed', 'rejected') DEFAULT 'pending',
  response_comments TEXT,
  handled_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (handled_by) REFERENCES users(id)
);

-- Insert sample users (password: password123)
INSERT INTO users (email, password_hash, role) VALUES
('student@example.com', '$2b$10$X7HYVsExK4S8LPAZdPVUaO4JZDCdFkpZbCULYwXqGXZ6z1lnwN2S2', 'student'),
('employee@example.com', '$2b$10$X7HYVsExK4S8LPAZdPVUaO4JZDCdFkpZbCULYwXqGXZ6z1lnwN2S2', 'employee');

-- Insert sample profiles
INSERT INTO student_profiles (user_id, reg_no, full_name, block, room_number) VALUES
(1, 'S12345', 'John Student', 'A', '203');

INSERT INTO employee_profiles (user_id, employee_id, full_name, department) VALUES
(2, 'E12345', 'Jane Employee', 'Maintenance');

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (request_number, student_id, reg_no, name, block, room_number, work_type, request_type, description, status, created_at) VALUES
('REQ-001', 1, 'S12345', 'John Student', 'A', '203', 'electrical', 'requisition', 'Light fixture not working in room', 'pending', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('REQ-002', 1, 'S12345', 'John Student', 'A', '203', 'plumbing', 'requisition', 'Leaking faucet in bathroom', 'approved', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('REQ-003', 1, 'S12345', 'John Student', 'A', '203', 'internet', 'feedbacks', 'Weak WiFi signal in room', 'completed', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('REQ-004', 1, 'S12345', 'John Student', 'A', '203', 'cleaning', 'suggestions', 'Request for deep cleaning of room', 'rejected', DATE_SUB(NOW(), INTERVAL 15 DAY));
