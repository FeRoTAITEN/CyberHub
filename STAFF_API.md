# Staff API Documentation

## Overview
This document outlines the API endpoints for managing employees and departments in the Cyber Hub platform.

## Base URL
```
/api/employees
/api/departments
```

## Employee Endpoints

### GET /api/employees
Get all employees with optional filtering.

**Query Parameters:**
- `includeInactive` (boolean): Include inactive employees (default: false)
- `departmentId` (number): Filter by department ID

**Response:**
```json
{
  "employees": [
    {
      "id": 1,
      "name": "Ahmed Ali",
      "name_ar": "أحمد علي",
      "email": "ahmed.ali@cyberhub.com",
      "phone": "+966-50-123-4567",
      "job_title": "IT Manager",
      "job_title_ar": "مدير تقنية المعلومات",
      "department_id": 1,
      "location": "Riyadh",
      "hire_date": "2022-01-15T00:00:00.000Z",
      "status": "active",
      "gender": "male",
      "is_active": true,
      "department": {
        "id": 1,
        "name": "Information Technology",
        "description": "IT Department responsible for all technical infrastructure and systems"
      }
    }
  ]
}
```

### POST /api/employees
Create a new employee.

**Request Body:**
```json
{
  "name": "Ahmed Ali",
  "name_ar": "أحمد علي",
  "email": "ahmed.ali@cyberhub.com",
  "phone": "+966-50-123-4567",
  "job_title": "IT Manager",
  "job_title_ar": "مدير تقنية المعلومات",
  "department_id": 1,
  "location": "Riyadh",
  "hire_date": "2022-01-15",
  "status": "active",
  "gender": "male"
}
```

**Required Fields:**
- `name`: Employee name (English)
- `email`: Employee email (unique)
- `department_id`: Department ID

### GET /api/employees/[id]
Get a specific employee by ID.

**Response:**
```json
{
  "employee": {
    "id": 1,
    "name": "Ahmed Ali",
    "name_ar": "أحمد علي",
    "email": "ahmed.ali@cyberhub.com",
    "phone": "+966-50-123-4567",
    "job_title": "IT Manager",
    "job_title_ar": "مدير تقنية المعلومات",
    "department_id": 1,
    "location": "Riyadh",
    "hire_date": "2022-01-15T00:00:00.000Z",
    "status": "active",
    "gender": "male",
    "is_active": true,
    "department": {
      "id": 1,
      "name": "Information Technology",
      "description": "IT Department responsible for all technical infrastructure and systems"
    }
  }
}
```

### PUT /api/employees/[id]
Update an existing employee.

**Request Body:** (All fields optional)
```json
{
  "name": "Ahmed Ali Updated",
  "name_ar": "أحمد علي محدث",
  "email": "ahmed.ali.updated@cyberhub.com",
  "phone": "+966-50-123-4568",
  "job_title": "Senior IT Manager",
  "job_title_ar": "مدير تقنية المعلومات أول",
  "department_id": 1,
  "location": "Jeddah",
  "hire_date": "2022-01-15",
  "status": "active",
  "gender": "male",
  "is_active": true
}
```

### DELETE /api/employees/[id]
Soft delete an employee (sets is_active to false).

**Response:**
```json
{
  "message": "Employee deactivated successfully",
  "employee": {
    "id": 1,
    "is_active": false
  }
}
```

## Department Endpoints

### GET /api/departments
Get all departments with their managers and employees.

**Response:**
```json
{
  "departments": [
    {
      "id": 1,
      "name": "Information Technology",
      "description": "IT Department responsible for all technical infrastructure and systems",
      "manager": {
        "id": 1,
        "name": "Ahmed Ali",
        "name_ar": "أحمد علي",
        "email": "ahmed.ali@cyberhub.com"
      },
      "employees": [
        {
          "id": 1,
          "name": "Ahmed Ali",
          "name_ar": "أحمد علي",
          "email": "ahmed.ali@cyberhub.com",
          "job_title": "IT Manager",
          "job_title_ar": "مدير تقنية المعلومات"
        }
      ]
    }
  ]
}
```

### POST /api/departments
Create a new department.

**Request Body:**
```json
{
  "name": "New Department",
  "description": "Department description",
  "manager_id": 1
}
```

**Required Fields:**
- `name`: Department name

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: name, email, department_id"
}
```

### 404 Not Found
```json
{
  "error": "Employee not found"
}
```

### 409 Conflict
```json
{
  "error": "Employee with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch employees"
}
```

## Data Models

### Employee Model
```typescript
interface Employee {
  id: number;
  name: string;
  name_ar?: string;
  email: string;
  phone?: string;
  job_title?: string;
  job_title_ar?: string;
  department_id: number;
  avatar?: string;
  location?: string;
  hire_date?: Date;
  status?: string;
  gender?: string;
  is_active: boolean;
  department?: Department;
}
```

### Department Model
```typescript
interface Department {
  id: number;
  name: string;
  description?: string;
  manager?: Employee;
  manager_id?: number;
  employees?: Employee[];
}
```

## Usage Examples

### Frontend Integration
```javascript
// Fetch all active employees
const response = await fetch('/api/employees');
const data = await response.json();
const employees = data.employees;

// Create new employee
const newEmployee = await fetch('/api/employees', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    name_ar: 'جون دو',
    email: 'john.doe@cyberhub.com',
    department_id: 1
  })
});

// Update employee
const updatedEmployee = await fetch('/api/employees/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    job_title: 'Senior Developer'
  })
});
```

## Features

### ✅ Implemented Features
- **CRUD Operations**: Full Create, Read, Update, Delete for employees
- **Department Management**: Get departments with managers and employees
- **Soft Delete**: Employees are deactivated rather than permanently deleted
- **Email Validation**: Prevents duplicate email addresses
- **Bilingual Support**: Arabic and English names and job titles
- **Filtering**: Filter employees by department and active status
- **Error Handling**: Comprehensive error responses
- **Data Relationships**: Proper foreign key relationships

### 🔄 Future Enhancements
- **Search Functionality**: Search by name, email, or job title
- **Pagination**: Handle large employee lists
- **File Upload**: Employee avatar upload
- **Bulk Operations**: Import/export employee data
- **Audit Trail**: Track employee changes
- **Role-based Access**: Different permissions for different user roles 