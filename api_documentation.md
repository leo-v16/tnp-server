# Internship & Training Server - API Handover Documentation

This documentation provides details of all endpoints, request validation structures, response formats, authentication requirements, and critical developer/frontend integration notes.

---

## 1. Overview & Core Architecture

### Base URL
All routes are prefixed according to their resource namespace. For local development, the base URL is typically:
`http://localhost:<PORT>` (e.g. `http://localhost:5000` or `3000`)

### Authentication
The server uses **JWT-based Bearer Authentication**.
* **Header Format**: `Authorization: Bearer <token>`
* **Token Lifetime**: 12 hours
* **Decoded Payload Structure (`UserJwtPayload`)**:
  ```json
  {
    "auth_user_id": 12,
    "auth_email": "user@example.com",
    "auth_role_id": 2,
    "iat": 1720442300,
    "exp": 1720485500
  }
  ```

---

## 2. Global Response Formats

### A. Success Response (Standard)
```json
{
  "success": true,
  "message": "Action description message",
  "data": { ... } // Or [ ... ]
}
```

### B. Validation Error (Status: 400 Bad Request)
Returned when request parameters, body, or query fails Zod validation.
```json
{
  "success": false,
  "errors": [
    {
      "code": "invalid_string",
      "path": ["body", "email"],
      "message": "Invalid email address"
    }
  ]
}
```

### C. General/Business Logic Error (Status: 4xx/5xx)
Returned for authentication, authorization, not found, or internal server errors.
```json
{
  "success": false,
  "message": "Error description message"
}
```

---

## 3. Role Mappings & ID References

The database utilizes specific static integer IDs for roles:

| Role ID | Role Name | Description |
| :--- | :--- | :--- |
| **1** | `SuperAdmin` | Full administrative control |
| **2** | `Student` | Job/Training applicant |
| **3** | `Coordinator` | Department representative |
| **4** | `Organization` | Training & Placement provider |

---

## 4. Route Summary Table

| Namespace | Endpoint | Method | Authentication | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **User** | `/users/register` | `POST` | Public | Register a base user (Admin, Student, Org, Coordinator) |
| | `/users/login` | `POST` | Public | Login and obtain JWT token + Profile Details |
| | `/users/` | `GET` | `SuperAdmin` | Retrieve list of all users |
| | `/users/:user_id` | `GET` | `SuperAdmin` | Retrieve single user with detailed profile |
| **Student** | `/students` | `POST` | `SuperAdmin` | Register student profile (Transactional with user table) |
| | `/students/me` | `PUT` | `Student` | Update own student profile details |
| | `/students/me` | `GET` | `Student` | Retrieve own student profile details |
| | `/students/:user_id` | `PUT` | `SuperAdmin` | Admin-level student profile update |
| | `/students/:user_id` | `GET` | `Student` (self), `SuperAdmin`, `Coordinator` (dept) | Retrieve single student profile details |
| | `/students/` | `GET` | `SuperAdmin` | Retrieve list of all students |
| | `/students/me/dashboard` | `GET` | `Student` | Retrieve applied & eligible trainings for student |
| **Org** | `/organizations` | `POST` | Public | Register organization and request approval |
| | `/organizations/:organization_id/status` | `POST` | `SuperAdmin` | Approve organization status (approval_id = 1) |
| | `/organizations/:organization_id/status` | `POST` | `SuperAdmin` | Reject organization status (approval_id = 2) |
| | `/organizations?status=approved`| `GET` | `SuperAdmin` | Retrieve list of approved organizations |
| | `/organizations?status=pending` | `GET` | `SuperAdmin` | Retrieve list of pending organizations (approval_id = 0) |
| | `/organizations?status=rejected`| `GET` | `SuperAdmin` | Retrieve list of rejected organizations |
| | `/organizations/:organization_id` | `GET` | Public | Retrieve single organization detail |
| **Training**| `/trainings` | `POST` | `Org`, `SuperAdmin`, `Coordinator` | Create a new training program |
| | `/trainings/` | `GET` | All Authenticated | Get list of trainings (filtered by role eligibility) |
| | `/trainings/:training_id` | `GET` | All Authenticated | Get details of a single training program |
| **App** | `/training-applications` | `POST` | `Student` | Apply for a training program |
| | `/training-applications/:training_id/students/:student_id/status`| `POST` | `Org`, `Coordinator`, `SuperAdmin` | Approve student's training application |
| | `/training-applications` | `GET` | All Authenticated | View training applications submitted/received |
| **Dashboard** | `/dashboards` | `GET` | All Authenticated | Retrieve role-specific dashboard metrics |
| **Metadata**| `/departments/` | `GET` | Public | List all departments |
| | `/categories/` | `GET` | Public | List student/placement categories |
| | `/divisions/` | `GET` | Public | List educational divisions (First, Second, etc.) |
| | `/genders/` | `GET` | Public | List genders |
| | `/semesters/` | `GET` | Public | List academic semesters |
| | `/skills/` | `GET` | Public | List student skills |

---

## 5. Detailed Endpoint Documentation

### User Namespace (`/users`)

#### 1. User Register
* **Path**: `POST /users/register`
* **Auth**: None
* **Body Requirements (Strict)**:
  ```json
  {
    "email": "user@domain.com", // string (valid email format)
    "password": "securepassword", // string (min length 6)
    "role_id": 2, // number (1=SuperAdmin, 2=Student, 3=Coordinator, 4=Organization)
    "mobile_no": "1234567890" // string (exactly 10 digits)
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "User register successful",
    "data": {
      "user_id": 5,
      "role_id": 2,
      "email": "user@domain.com",
      "mobile_no": "1234567890",
      "created_on": "2026-07-08T11:15:30.000Z",
      "updated_on": "2026-07-08T11:15:30.000Z"
    }
  }
  ```

#### 2. User Login
* **Path**: `POST /users/login`
* **Auth**: None
* **Body Requirements (Strict)**:
  ```json
  {
    "email": "user@domain.com",
    "password": "securepassword",
    "role_id": 2
  }
  ```
* **Success Response (Status: 200 OK)**:
  Returns user info, generated JWT token, and role-specific profile details merged dynamically.
  ```json
  {
    "success": true,
    "message": "User login successful",
    "data": {
      "user_id": 5,
      "role_id": 2,
      "email": "user@domain.com",
      "mobile_no": "1234567890",
      "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "roll_no": "20BCE0012", // (Merged Student Details if Student)
      "name": "Jane Doe",
      "age": "21",
      "semester_id": 6,
      "department_id": 1,
      "gender_id": 2,
      "cgpa": "8.80",
      "has_backlog": false
    }
  }
  ```

#### 3. Get All Users
* **Path**: `GET /users/`
* **Auth**: `SuperAdmin` (Role 1)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "All user list provided",
    "data": [
      {
        "user_id": 1,
        "role_id": 1,
        "email": "admin@tnp.com",
        "mobile_no": "0987654321",
        "role_table": { "role_id": 1, "role": "SuperAdmin" }
      }
    ]
  }
  ```

#### 4. Get One User Detail
* **Path**: `GET /users/:user_id`
* **Auth**: `SuperAdmin` (Role 1)
* **Path Params**: `user_id` (numeric)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "User details provided",
    "data": {
      "user_id": 5,
      "role_id": 2,
      "email": "student@tnp.com",
      "mobile_no": "1234567890",
      "name": "Jane Doe",
      "roll_no": "20BCE0012",
      "department_table": { "department_id": 1, "dept_name": "Computer Science" }
      // Dynamic profile joins
    }
  }
  ```

---

### Student Namespace (`/students`)

#### 1. Register Student Profile
* **Path**: `POST /students`
* **Auth**: `SuperAdmin` (Role 1)
* **Body Requirements (Strict)**:
  ```json
  {
    "roll_no": "20BCE0012",
    "email": "student@domain.com",
    "password": "securepassword",
    "mobile_no": "1234567890",
    "gender_id": 2,
    "department_id": 1,
    "semester_id": 6,
    "name": "Jane Doe",
    "age": "21"
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Student with roll: 20BCE0012 created",
    "data": {
      "user_id": 6,
      "roll_no": "20BCE0012",
      "name": "Jane Doe",
      "age": "21",
      "semester_id": 6,
      "department_id": 1,
      "gender_id": 2
    }
  }
  ```

#### 2. Update Student Profile (Self)
* **Path**: `PUT /students/me`
* **Auth**: `Student` (Role 2)
* **Body Requirements (Optional properties)**:
  ```json
  {
    "email": "new-email@domain.com",
    "mobile_no": "0987654321",
    "has_backlog": false,
    "cgpa": 8.75, // numeric decimal
    "tenth_divison_id": 1,
    "twelfth_division_id": 1,
    "category_id": 2,
    "resume_url": "https://storage.provider.com/resumes/my_resume.pdf",
    "image_url": "https://storage.provider.com/images/my_photo.png"
  }
  ```
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Student with roll: 20BCE0012 updated",
    "data": { ... } // Updated student record
  }
  ```

#### 3. Update Student Profile as Admin
* **Path**: `PUT /students/:user_id`
* **Auth**: `SuperAdmin` (Role 1)
* **Body Requirements (Optional properties)**: Same as Student self update, but also allows `roll_no`, `name`, `age`, `gender_id`, `department_id`, `semester_id`, and `is_graduate` (boolean).

#### 4. Retrieve Own Student Profile
* **Path**: `GET /students/me`
* **Auth**: `Student` (Role 2)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched profile",
    "data": {
      "user_id": 6,
      "roll_no": "20BCE0012",
      "name": "Jane Doe",
      "age": 21,
      "semester_id": 6,
      "gender_id": 2,
      "cgpa": 8.5,
      "department_id": 1,
      "has_backlog": false,
      "is_graduate": false,
      "category_id": 1,
      "resume_url": "https://resume-url.com",
      "image_url": "https://image-url.com"
    }
  }
  ```

#### 5. Retrieve Single Student Profile
* **Path**: `GET /students/:user_id`
* **Auth**: `Student` who owns the profile, `SuperAdmin` (Role 1), or the coordinator (`Coordinator` Role 3) of the student's department.
* **Success Response (Status: 200 OK)**: Same as Retrieve Own Student Profile.
* **Error Response (Status: 403 Forbidden)**: If the user is a Student requesting another student's profile, or a Coordinator requesting a profile of a student from another department.

#### 6. List All Students
* **Path**: `GET /students/`
* **Auth**: `SuperAdmin` (Role 1)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched students",
    "data": [
      {
        "user_id": 6,
        "roll_no": "20BCE0012",
        "name": "Jane Doe",
        "user_table": { "email": "student@domain.com", "mobile_no": "1234567890" }
      }
    ]
  }
  ```

#### 7. Student Dashboard
* **Path**: `GET /students/me/dashboard`
* **Auth**: `Student` (Role 2)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched dashboard",
    "data": {
      "appliedTrainings": [
        {
          "training_id": 1,
          "student_id": 6,
          "status_id": 0,
          "date_of_submission": "2026-07-08T00:00:00.000Z",
          "remarks": null,
          "training_table": {
            "training_id": 1,
            "title": "React Development Bootcamp",
            "is_active": true
          }
        }
      ],
      "eligibleTrainings": [
        {
          "training_id": 2,
          "title": "NodeJS Advanced Training",
          "min_cgpa": "7.50",
          "is_active": true
        }
      ]
    }
  }
  ```

---

### Organization Namespace (`/organizations`)

#### 1. Register Organization
* **Path**: `POST /organizations`
* **Auth**: None
* **Body Requirements (Strict)**:
  ```json
  {
    "name": "Google",
    "email": "contact@google.com",
    "mobile_no": "9999999999",
    "password": "securepassword"
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Organization with email: contact@google.com created",
    "data": {
      "user_id": 7,
      "name": "Google",
      "approval_id": 0, // 0 = Pending
      "is_active": true
    }
  }
  ```

#### 2. Approve Organization
* **Path**: `POST /organizations/:organization_id/status`
* **Auth**: `SuperAdmin` (Role 1)
* **Body Requirements**:
  ```json
  {
    "email": "contact@google.com"
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Organization with email: contact@google.com approved",
    "data": {
      "user_id": 7,
      "name": "Google",
      "approval_id": 1 // 1 = Approved
    }
  }
  ```

#### 3. Reject Organization
* **Path**: `POST /organizations/:organization_id/status`
* **Auth**: `SuperAdmin` (Role 1)
* **Body Requirements**:
  ```json
  {
    "email": "contact@google.com"
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Organization with email: contact@google.com rejected",
    "data": {
      "user_id": 7,
      "name": "Google",
      "approval_id": 2 // 2 = Rejected
    }
  }
  ```

#### 4. Get Organizations (Approved / Pending / Rejected)
* **Paths**:
  - `GET /organizations?status=approved`
  - `GET /organizations?status=pending`
  - `GET /organizations?status=rejected`
* **Auth**: `SuperAdmin` (Role 1)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched list of approved organization",
    "data": [
      {
        "user_id": 7,
        "name": "Google",
        "approval_id": 1,
        "user_table": { "email": "contact@google.com", "mobile_no": "9999999999" }
      }
    ]
  }
  ```

#### 5. Get Single Organization
* **Path**: `GET /organizations/:organization_id`
* **Auth**: None
* **Path Params**: `organization_id` (numeric)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched list of approved organization", // Note: hardcoded msg in API
    "data": {
      "user_id": 7,
      "name": "Google",
      "approval_id": 1,
      "is_active": true
    }
  }
  ```

---

### Training Namespace (`/trainings`)

#### 1. Create Training
* **Path**: `POST /trainings`
* **Auth**: `Organization` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Body Requirements (Strict)**:
  ```json
  {
    "title": "Advanced Web Security",
    "description": "Bootcamp on web app exploits", // optional
    "min_cgpa": 7.0, // optional number (decimal conversion handled by backend)
    "end_date": "2026-08-31T00:00:00.000Z", // optional datetime
    "start_date": "2026-08-01T00:00:00.000Z", // optional datetime
    "image_url": "https://storage.provider.com/banner.png", // optional string
    "last_date_of_submission": "2026-07-25T00:00:00.000Z", // optional datetime
    "is_active": true // optional boolean (default: true)
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Successfully created training",
    "data": {
      "training_id": 4,
      "creator_id": 7,
      "title": "Advanced Web Security",
      "description": "Bootcamp on web app exploits",
      "min_cgpa": "7.00",
      "start_date": "2026-08-01T00:00:00.000Z",
      "end_date": "2026-08-31T00:00:00.000Z",
      "image_url": "https://storage.provider.com/banner.png",
      "is_active": true
    }
  }
  ```

#### 2. Get All Trainings
* **Path**: `GET /trainings/`
* **Auth**: `Student` (Role 2), `Org` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Behavior**:
  - **For Students**: Only returns active trainings for which they meet eligibility requirements (e.g. `min_cgpa` threshold <= student's `cgpa`).
  - **For Creators (Org/Admin/Coordinator)**: Returns all training programs they created.
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched all trainings",
    "data": [
      {
        "training_id": 4,
        "title": "Advanced Web Security",
        "min_cgpa": "7.00",
        "is_active": true
      }
    ]
  }
  ```

#### 3. Get Single Training Details
* **Path**: `GET /trainings/:training_id`
* **Auth**: `Student` (Role 2), `Org` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Path Params**: `training_id` (numeric)
* **Behavior**: Similar role filtering logic applies.
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched training",
    "data": {
      "training_id": 4,
      "creator_id": 7,
      "title": "Advanced Web Security",
      "description": "Bootcamp on web app exploits",
      "min_cgpa": "7.00"
    }
  }
  ```

---

### Training Applications (`/training-applications`)

#### 1. Submit Application
* **Path**: `POST /training-applications`
* **Auth**: `Student` (Role 2)
* **Body Requirements (Strict)**:
  ```json
  {
    "training_id": 4
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Training Applcation created successfully",
    "data": {
      "training_id": 4,
      "student_id": 6,
      "status_id": 0, // 0 = Pending
      "date_of_submission": "2026-07-08T00:00:00.000Z",
      "remarks": null
    }
  }
  ```

#### 2. Approve Application
* **Path**: `POST /training-applications/:training_id/students/:student_id/status`
* **Auth**: `Organization` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Path Params**: 
  - `student_id`: number (Target student profile ID)
  - `training_id`: number (Target training program ID)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Training Application approved successfull",
    "data": {
      "training_id": 4,
      "student_id": 6,
      "status_id": 1 // 1 = Approved
    }
  }
  ```

#### 3. View Applications
* **Path**: `GET /training-applications`
* **Auth**: `Student` (Role 2), `Org` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Behavior**:
  - **For Students**: Returns their personal submitted applications.
  - **For Creators (Org/Coordinator/SuperAdmin)**: Returns applications received for trainings they created.
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Training Application fetch successfull",
    "data": [
      {
        "training_id": 4,
        "student_id": 6,
        "status_id": 0,
        "training_table": { "title": "Advanced Web Security" }
      }
    ]
  }
  ```

---

### Placements Namespace (`/placements`)

#### 1. Create Placement
* **Path**: `POST /placements`
* **Auth**: `Organization` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Body Requirements**:
  ```json
  {
    "title": "Software Engineer Intern",
    "description": "Looking for talented software developers.",
    "min_cgpa": 7.5,
    "last_date_of_submission": "2026-08-31T00:00:00.000Z",
    "is_active": true
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Successfully created placement",
    "data": {
      "placement_id": 1,
      "creator_id": 5,
      "title": "Software Engineer Intern",
      "description": "Looking for talented software developers.",
      "min_cgpa": "7.50",
      "last_date_of_submission": "2026-08-31T00:00:00.000Z",
      "is_active": true
    }
  }
  ```

#### 2. Get All Placements
* **Path**: `GET /placements`
* **Auth**: `Student` (Role 2), `Organization` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Behavior**:
  - **For Students**: Returns active placements where student's CGPA meets/exceeds `min_cgpa`.
  - **For Admins/Coordinators/Orgs**: Returns placements created by them.
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched all placements",
    "data": [ ... ]
  }
  ```

#### 3. Get Single Placement Details
* **Path**: `GET /placements/:placement_id`
* **Auth**: `Student` (Role 2), `Organization` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Path Params**: `placement_id` (numeric)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched placement",
    "data": { ... }
  }
  ```

---

### Placement Applications (`/placement-applications`)

#### 1. Submit Placement Application
* **Path**: `POST /placement-applications`
* **Auth**: `Student` (Role 2)
* **Body Requirements**:
  ```json
  {
    "placement_id": 1
  }
  ```
* **Success Response (Status: 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Placement Application created successfully",
    "data": {
      "placement_id": 1,
      "student_id": 12,
      "status_id": 0,
      "remarks": null
    }
  }
  ```

#### 2. Approve/Status Update Placement Application
* **Path**: `PATCH /placement-applications/:placement_id/students/:student_id/status`
* **Auth**: `Organization` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Path Params**:
  - `placement_id`: number (Target placement ID)
  - `student_id`: number (Target student profile ID)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Placement Application approved successfully",
    "data": {
      "placement_id": 1,
      "student_id": 12,
      "status_id": 1
    }
  }
  ```

#### 3. View Placement Applications
* **Path**: `GET /placement-applications`
* **Auth**: `Student` (Role 2), `Organization` (Role 4), `Coordinator` (Role 3), `SuperAdmin` (Role 1)
* **Behavior**:
  - **For Students**: Returns their personal submitted placement applications.
  - **For Creators (Org/Coordinator/SuperAdmin)**: Returns applications received for placements they created.
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Placement Applications fetched successfully",
    "data": [ ... ]
  }
  ```

---

### Dashboard Namespace (`/dashboards`)

#### 1. Retrieve Dashboard Data
* **Path**: `GET /dashboards`
* **Auth**: Student (Role 2), Coordinator (Role 3), SuperAdmin (Role 1)
* **Behavior**:
  - **For Students**: Returns applied/eligible trainings and placements.
  - **For Coordinators**: Returns student count in department, organization count, training and placement application stats.
  - **For SuperAdmins**: Returns system-wide statistics (student count, department count, org count, training count, training and placement approval percentages).

* **SuperAdmin Response Example**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched dashboard",
    "data": {
      "studentCount": 420,
      "departmentCount": 8,
      "organizationCount": 15,
      "trainingCount": 24,
      "trainingPercentage": 64.51,
      "placementCount": 12,
      "placementPercentage": 50.00
    }
  }
  ```

* **Coordinator Response Example**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched dashboard",
    "data": {
      "studentCount": 82,
      "organizationCount": 15,
      "trainingApplicationCount": 150,
      "trainingPercentage": 75.00,
      "placementApplicationCount": 40,
      "placementApplicationPercentage": 60.00
    }
  }
  ```

---

### Metadata Namespaces (Reference Data)

All metadata lists return simple reference objects: `{ <id_name>: number, <value_name>: string }`.

#### 1. Category Table
* **Path**: `GET /categories/`
* **Auth**: Public
* **Data Fields**: `category_id`, `category` (e.g. Unreserved, OBC, SC, ST)

#### 2. Department Table
* **Path**: `GET /departments/`
* **Auth**: Public
* **Data Fields**: `department_id`, `dept_name`, `is_active`

#### 4. Division Table
* **Path**: `GET /divisions/`
* **Auth**: Public
* **Data Fields**: `division_id`, `division` (e.g. Distinction, First, Second)

#### 5. Gender Table
* **Path**: `GET /genders/`
* **Auth**: Public
* **Data Fields**: `gender_id`, `gender` (e.g. Male, Female, Other)

#### 6. Semester Table
* **Path**: `GET /semesters/`
* **Auth**: Public
* **Data Fields**: `semester_id`, `semester` (e.g. Sem 1, Sem 2...)

#### 7. Skill Table
* **Path**: `GET /skills/`
* **Auth**: Public
* **Data Fields**: `skill_id`, `skill` (e.g. TypeScript, React, Python)

---

## 6. Critical Integration & Backend Bug Warnings

All critical bugs have been resolved.