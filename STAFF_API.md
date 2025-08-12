# Staff API Documentation

## Overview

The Staff API provides endpoints for managing and retrieving staff member information with advanced search and filtering capabilities.

## Base URL

```
/api/staff
```

## Endpoints

### GET /api/staff

Retrieve staff members with optional search and filtering.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in name, name_ar, email, job_title, job_title_ar | `?search=ahmed` |
| `department` | string/number | Filter by department ID or name | `?department=Cybersecurity` |
| `status` | string | Filter by status: `active`, `inactive`, `all` | `?status=active` |
| `limit` | number | Limit number of results | `?limit=10` |

#### Example Requests

```bash
# Get all staff
GET /api/staff

# Search for staff members
GET /api/staff?search=ahmed

# Filter by department
GET /api/staff?department=Cybersecurity

# Filter by status
GET /api/staff?status=active

# Combined filters
GET /api/staff?search=ahmad&department=1&status=active&limit=10
```

#### Response Structure

```json
{
  "success": true,
  "data": [
    {
      "id": 64,
      "name": "Ahmed Al-Rashid",
      "name_ar": "أحمد الراشد",
      "email": "ahmed.alrashid@salam.sa",
      "phone": "+966501111111",
      "job_title": "Senior Network Engineer",
      "job_title_ar": "مهندس شبكات أول",
      "department_id": 1,
      "avatar": "avatar1.png",
      "location": "Riyadh",
      "hire_date": "2020-03-15T00:00:00.000Z",
      "status": "active",
      "gender": "male",
      "is_active": true,
      "department": {
        "id": 1,
        "name": "Information Technology",
        "description": "IT Department responsible for all technical infrastructure and systems"
      }
    }
  ],
  "meta": {
    "total": 51,
    "active": 51,
    "inactive": 0,
    "filtered": 1
  },
  "departments": [
    {
      "id": 1,
      "name": "Information Technology",
      "_count": {
        "employees": 6
      }
    }
  ],
  "filters": {
    "search": "ahmed",
    "department": null,
    "status": null,
    "limit": null
  }
}
```

### POST /api/staff

Create a new staff member.

#### Request Body

```json
{
  "name": "John Doe",
  "name_ar": "جون دو", // optional
  "email": "john.doe@salam.sa",
  "phone": "+966501234567", // optional
  "job_title": "Software Engineer",
  "job_title_ar": "مهندس برمجيات", // optional
  "department_id": 1,
  "location": "Riyadh", // optional
  "hire_date": "2024-01-15", // optional
  "gender": "male", // optional, defaults to "male"
  "is_active": true // optional, defaults to true
}
```

#### Required Fields

- `name`
- `email`
- `job_title`
- `department_id`

#### Response

```json
{
  "success": true,
  "data": {
    "id": 82,
    "name": "John Doe",
    "name_ar": "جون دو",
    "email": "john.doe@salam.sa",
    "phone": "+966501234567",
    "job_title": "Software Engineer",
    "job_title_ar": "مهندس برمجيات",
    "department_id": 1,
    "location": "Riyadh",
    "hire_date": "2024-01-15T00:00:00.000Z",
    "gender": "male",
    "is_active": true,
    "department": {
      "id": 1,
      "name": "Information Technology",
      "description": "IT Department responsible for all technical infrastructure and systems"
    }
  },
  "message": "Staff member created successfully"
}
```

## Error Responses

### Validation Errors (400)

```json
{
  "success": false,
  "error": "Missing required fields",
  "required": ["name", "email", "job_title", "department_id"]
}
```

### Duplicate Email (400)

```json
{
  "success": false,
  "error": "Employee with this email already exists"
}
```

### Department Not Found (400)

```json
{
  "success": false,
  "error": "Department not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Failed to fetch staff members",
  "message": "Detailed error message"
}
```

## Data Model

### Staff Member Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier |
| `name` | string | Full name in English |
| `name_ar` | string | Full name in Arabic (optional) |
| `email` | string | Email address (unique) |
| `phone` | string | Phone number (optional) |
| `job_title` | string | Job title in English |
| `job_title_ar` | string | Job title in Arabic (optional) |
| `department_id` | number | Department ID (foreign key) |
| `avatar` | string | Avatar filename (optional) |
| `location` | string | Work location (optional) |
| `hire_date` | string | Hire date in ISO format (optional) |
| `status` | string | Legacy status field |
| `gender` | string | Gender (male/female) |
| `is_active` | boolean | Active status |
| `department` | object | Department information |

### Department Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Department ID |
| `name` | string | Department name |
| `description` | string | Department description |

## Search Functionality

The search parameter performs case-insensitive partial matching across:
- `name` (English name)
- `name_ar` (Arabic name)
- `email`
- `job_title` (English job title)
- `job_title_ar` (Arabic job title)

## Filtering

- **Department**: Can filter by department ID (number) or department name (string)
- **Status**: 
  - `active`: Shows only active employees (`is_active: true`)
  - `inactive`: Shows only inactive employees (`is_active: false`)
  - `all`: Shows all employees (default)

## Sorting

Results are automatically sorted by:
1. Active status (active employees first)
2. Name (alphabetically)

## Usage Examples

### Frontend Integration

```javascript
// Fetch all staff
const response = await fetch('/api/staff');
const data = await response.json();

if (data.success) {
  const staff = data.data;
  const departments = data.departments;
  const stats = data.meta;
}

// Search with filters
const searchResponse = await fetch('/api/staff?search=ahmed&department=1&status=active');
const searchData = await searchResponse.json();

// Create new staff member
const newStaff = await fetch('/api/staff', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@salam.sa',
    job_title: 'Software Engineer',
    department_id: 1
  })
});
```

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production use.

## Security

- Input validation on all fields
- Email uniqueness check
- Department existence validation
- SQL injection protection via Prisma ORM

## Performance Considerations

- Database queries are optimized with proper indexing
- Includes department information to minimize additional queries
- Supports pagination via `limit` parameter
- Case-insensitive search uses database-level operations 