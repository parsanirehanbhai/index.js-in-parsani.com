# Dilsha Danta - Attendance & Hisab-Kitab Management System

A comprehensive system for managing attendance and financial records, designed for organizations that need to track daily attendance and payments.

## Features

- **Dashboard**: View daily attendance statistics and payment summaries
- **Attendance Tracking**: Mark attendance with a single click and auto-save to Excel
- **Customer Management**: Add, edit, and delete customer information
- **Payment Tracking**: Record payments and track outstanding dues
- **Auto-generated Messages**: Create custom messages for customers with their attendance and payment status
- **Excel Reports**: Generate and export reports for attendance and payments
- **Mobile-friendly UI**: Responsive design that works on all devices

## Tech Stack

- **Frontend**: React.js with TypeScript and TailwindCSS
- **Backend**: Node.js and Express.js
- **Data Storage**: Excel files (using ExcelJS)
- **Authentication**: JWT-based admin authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev:all
```

This will start both the frontend and backend servers concurrently.

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Default Login

- Username: admin
- Password: password

## Project Structure

```
├── backend/             # Backend Express server
│   ├── data/            # Excel files for data storage
│   └── server.js        # Main server file
├── src/                 # Frontend React application
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── pages/           # Main application pages
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables
└── package.json         # Project dependencies and scripts
```

## Excel File Structure

The system uses three main Excel files for data storage:

1. **customers.xlsx**: Stores customer information
   - ID, Name, Phone, Email, Join Date

2. **attendance.xlsx**: Records daily attendance
   - ID, Customer ID, Date, Status

3. **payments.xlsx**: Tracks all payment transactions
   - ID, Customer ID, Date, Amount, Type, Notes

## License

This project is licensed under the MIT License.