import express from 'express';
import cors from 'cors';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create data directory if it doesn't exist
const dataDir = join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create files if they don't exist
const attendanceFile = join(dataDir, 'attendance.xlsx');
const customersFile = join(dataDir, 'customers.xlsx');
const paymentsFile = join(dataDir, 'payments.xlsx');

// Create initial Excel files if they don't exist
const initializeExcelFiles = async () => {
  // Customers file
  if (!fs.existsSync(customersFile)) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Customers');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Join Date', key: 'joinDate', width: 15 }
    ];
    
    await workbook.xlsx.writeFile(customersFile);
  }
  
  // Attendance file
  if (!fs.existsSync(attendanceFile)) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Customer ID', key: 'customerId', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    
    await workbook.xlsx.writeFile(attendanceFile);
  }
  
  // Payments file
  if (!fs.existsSync(paymentsFile)) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payments');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Customer ID', key: 'customerId', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 }
    ];
    
    await workbook.xlsx.writeFile(paymentsFile);
  }
};

// Initialize files
initializeExcelFiles();

// Middleware
app.use(cors());
app.use(express.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Routes

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // For simplicity, using hardcoded credentials. In production, use a database.
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { username } });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Get all customers
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(customersFile);
    const worksheet = workbook.getWorksheet('Customers');
    
    const customers = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        customers.push({
          id: row.getCell('id').value,
          name: row.getCell('name').value,
          phone: row.getCell('phone').value,
          email: row.getCell('email').value,
          joinDate: row.getCell('joinDate').value
        });
      }
    });
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new customer
app.post('/api/customers', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(customersFile);
    const worksheet = workbook.getWorksheet('Customers');
    
    // Generate new ID
    const lastRow = worksheet.lastRow;
    const newId = lastRow ? parseInt(lastRow.getCell('id').value) + 1 : 1;
    
    // Add new row
    worksheet.addRow({
      id: newId,
      name,
      phone,
      email,
      joinDate: new Date().toISOString().split('T')[0]
    });
    
    await workbook.xlsx.writeFile(customersFile);
    
    res.status(201).json({ 
      id: newId,
      name,
      phone,
      email,
      joinDate: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record attendance
app.post('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const { customerId, date, status } = req.body;
    
    if (!customerId || !date || !status) {
      return res.status(400).json({ error: 'Customer ID, date and status are required' });
    }
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(attendanceFile);
    const worksheet = workbook.getWorksheet('Attendance');
    
    // Check if entry already exists
    let existingRow = null;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && 
          row.getCell('customerId').value == customerId && 
          row.getCell('date').value === date) {
        existingRow = row;
      }
    });
    
    if (existingRow) {
      // Update existing record
      existingRow.getCell('status').value = status;
    } else {
      // Generate new ID and add new row
      const lastRow = worksheet.lastRow;
      const newId = lastRow ? parseInt(lastRow.getCell('id').value) + 1 : 1;
      
      worksheet.addRow({
        id: newId,
        customerId,
        date,
        status
      });
    }
    
    await workbook.xlsx.writeFile(attendanceFile);
    
    res.status(201).json({ success: true, message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance for a specific date
app.get('/api/attendance/:date', authenticateToken, async (req, res) => {
  try {
    const { date } = req.params;
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(attendanceFile);
    const worksheet = workbook.getWorksheet('Attendance');
    
    const attendance = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && row.getCell('date').value === date) {
        attendance.push({
          id: row.getCell('id').value,
          customerId: row.getCell('customerId').value,
          date: row.getCell('date').value,
          status: row.getCell('status').value
        });
      }
    });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record payment
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { customerId, amount, type, notes } = req.body;
    
    if (!customerId || !amount || !type) {
      return res.status(400).json({ error: 'Customer ID, amount and type are required' });
    }
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(paymentsFile);
    const worksheet = workbook.getWorksheet('Payments');
    
    // Generate new ID
    const lastRow = worksheet.lastRow;
    const newId = lastRow ? parseInt(lastRow.getCell('id').value) + 1 : 1;
    
    // Add new row
    worksheet.addRow({
      id: newId,
      customerId,
      date: new Date().toISOString().split('T')[0],
      amount,
      type,
      notes: notes || ''
    });
    
    await workbook.xlsx.writeFile(paymentsFile);
    
    res.status(201).json({ 
      id: newId,
      customerId,
      date: new Date().toISOString().split('T')[0],
      amount,
      type,
      notes: notes || ''
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer payments
app.get('/api/payments/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(paymentsFile);
    const worksheet = workbook.getWorksheet('Payments');
    
    const payments = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && row.getCell('customerId').value == customerId) {
        payments.push({
          id: row.getCell('id').value,
          customerId: row.getCell('customerId').value,
          date: row.getCell('date').value,
          amount: row.getCell('amount').value,
          type: row.getCell('type').value,
          notes: row.getCell('notes').value
        });
      }
    });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate report
app.post('/api/reports', authenticateToken, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;
    
    if (!type || !startDate || !endDate) {
      return res.status(400).json({ error: 'Report type, start date, and end date are required' });
    }
    
    // Different logic based on report type
    if (type === 'attendance') {
      // Generate attendance report
      const attendanceWorkbook = new ExcelJS.Workbook();
      await attendanceWorkbook.xlsx.readFile(attendanceFile);
      const attendanceSheet = attendanceWorkbook.getWorksheet('Attendance');
      
      const customersWorkbook = new ExcelJS.Workbook();
      await customersWorkbook.xlsx.readFile(customersFile);
      const customersSheet = customersWorkbook.getWorksheet('Customers');
      
      // Create a new workbook for the report
      const reportWorkbook = new ExcelJS.Workbook();
      const reportSheet = reportWorkbook.addWorksheet('Attendance Report');
      
      reportSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Customer ID', key: 'customerId', width: 15 },
        { header: 'Customer Name', key: 'customerName', width: 30 },
        { header: 'Status', key: 'status', width: 15 }
      ];
      
      // Map of customer IDs to names
      const customerMap = {};
      customersSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          customerMap[row.getCell('id').value] = row.getCell('name').value;
        }
      });
      
      // Filter attendance records by date range
      attendanceSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const date = row.getCell('date').value;
          if (date >= startDate && date <= endDate) {
            const customerId = row.getCell('customerId').value;
            reportSheet.addRow({
              date,
              customerId,
              customerName: customerMap[customerId] || 'Unknown',
              status: row.getCell('status').value
            });
          }
        }
      });
      
      // Save the report
      const reportPath = join(dataDir, `attendance_report_${startDate}_to_${endDate}.xlsx`);
      await reportWorkbook.xlsx.writeFile(reportPath);
      
      res.json({ 
        success: true, 
        message: 'Attendance report generated successfully',
        reportPath: reportPath
      });
    } else if (type === 'payment') {
      // Generate payment report
      const paymentsWorkbook = new ExcelJS.Workbook();
      await paymentsWorkbook.xlsx.readFile(paymentsFile);
      const paymentsSheet = paymentsWorkbook.getWorksheet('Payments');
      
      const customersWorkbook = new ExcelJS.Workbook();
      await customersWorkbook.xlsx.readFile(customersFile);
      const customersSheet = customersWorkbook.getWorksheet('Customers');
      
      // Create a new workbook for the report
      const reportWorkbook = new ExcelJS.Workbook();
      const reportSheet = reportWorkbook.addWorksheet('Payment Report');
      
      reportSheet.columns = [
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Customer ID', key: 'customerId', width: 15 },
        { header: 'Customer Name', key: 'customerName', width: 30 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Notes', key: 'notes', width: 30 }
      ];
      
      // Map of customer IDs to names
      const customerMap = {};
      customersSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          customerMap[row.getCell('id').value] = row.getCell('name').value;
        }
      });
      
      // Filter payment records by date range
      paymentsSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const date = row.getCell('date').value;
          if (date >= startDate && date <= endDate) {
            const customerId = row.getCell('customerId').value;
            reportSheet.addRow({
              date,
              customerId,
              customerName: customerMap[customerId] || 'Unknown',
              amount: row.getCell('amount').value,
              type: row.getCell('type').value,
              notes: row.getCell('notes').value
            });
          }
        }
      });
      
      // Save the report
      const reportPath = join(dataDir, `payment_report_${startDate}_to_${endDate}.xlsx`);
      await reportWorkbook.xlsx.writeFile(reportPath);
      
      res.json({ 
        success: true, 
        message: 'Payment report generated successfully',
        reportPath: reportPath
      });
    } else {
      return res.status(400).json({ error: 'Invalid report type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});