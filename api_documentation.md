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
| **User** | `/user/register` | `POST` | Public | Register a base user (Admin, Student, Org, Coordinator) |
| | `/user/login` | `POST` | Public | Login and obtain JWT token + Profile Details |
| | `/user/` | `GET` | `SuperAdmin` | Retrieve list of all users |
| | `/user/:user_id` | `GET` | `SuperAdmin` | Retrieve single user with detailed profile |
| **Student** | `/student/register` | `POST` | `SuperAdmin` | Register student profile (Transactional with user table) |
| | `/student/update` | `PUT` | `Student` | Update own student profile details |
| | `/student/update/:id` | `PUT` | `SuperAdmin` | Admin-level student profile update (See Warnings section) |
| | `/student/` | `GET` | `SuperAdmin` | Retrieve list of all students |
| | `/student/dashboard` | `GET` | `Student` | Retrieve applied & eligible trainings for student |
| **Org** | `/organization/register` | `POST` | Public | Register organization and request approval |
| | `/organization/approve` | `POST` | `SuperAdmin` | Approve organization status (approval_id = 1) |
| | `/organization/reject` | `POST` | `SuperAdmin` | Reject organization status (approval_id = 2) |
| | `/organization/approved`| `GET` | `SuperAdmin` | Retrieve list of approved organizations |
| | `/organization/pending` | `GET` | `SuperAdmin` | Retrieve list of pending organizations (approval_id = 0) |
| | `/organization/rejected`| `GET` | `SuperAdmin` | Retrieve list of rejected organizations |
| | `/organization/:organization_id` | `GET` | Public | Retrieve single organization detail |
| **Training**| `/training/create` | `POST` | `Org`, `SuperAdmin`, `Coordinator` | Create a new training program |
| | `/training/` | `GET` | All Authenticated | Get list of trainings (filtered by role eligibility) |
| | `/training/:training_id` | `GET` | All Authenticated | Get details of a single training program |
| **App** | `/training-application/create` | `POST` | `Student` | Apply for a training program |
| | `/training-application/approve/:student_id/:training_id`| `POST` | `Org`, `Coordinator`, `SuperAdmin` | Approve student's training application |
| | `/training-application/view` | `GET` | All Authenticated | View training applications submitted/received |
| **Admin** | `/admin/dashboard` | `GET` | `SuperAdmin` | Retrieve system-wide metrics (Student count, etc.) |
| **Metadata**| `/department/` | `GET` | Public | List all departments |
| | `/department/dashboard` | `GET` | `Coordinator` | Department dashboard metrics (See Warnings) |
| | `/category/` | `GET` | Public | List student/placement categories |
| | `/division/` | `GET` | Public | List educational divisions (First, Second, etc.) |
| | `/gender/` | `GET` | Public | List genders |
| | `/semester/` | `GET` | Public | List academic semesters |
| | `/skill/` | `GET` | Public | List student skills |

---

## 5. Detailed Endpoint Documentation

### User Namespace (`/user`)

#### 1. User Register
* **Path**: `POST /user/register`
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
* **Path**: `POST /user/login`
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
* **Path**: `GET /user/`
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
* **Path**: `GET /user/:user_id`
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

### Student Namespace (`/student`)

#### 1. Register Student Profile
* **Path**: `POST /student/register`
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
* **Path**: `PUT /student/update`
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
* **Path**: `PUT /student/update/:id`
* **Auth**: `SuperAdmin` (Role 1)
* **Warning**: *See developer warnings section regarding severe logic issues with this endpoint.*
* **Body Requirements (Optional properties)**: Same as Student self update, but also allows `roll_no`, `name`, `age`, `gender_id`, `department_id`, `semester_id`, and `is_graduate` (boolean).

#### 4. List All Students
* **Path**: `GET /student/`
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

#### 5. Student Dashboard
* **Path**: `GET /student/dashboard`
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

### Organization Namespace (`/organization`)

#### 1. Register Organization
* **Path**: `POST /organization/register`
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
* **Path**: `POST /organization/approve`
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
* **Path**: `POST /organization/reject`
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
  - `GET /organization/approved`
  - `GET /organization/pending`
  - `GET /organization/rejected`
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
* **Path**: `GET /organization/:organization_id`
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

### Training Namespace (`/training`)

#### 1. Create Training
* **Path**: `POST /training/create`
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
* **Path**: `GET /training/`
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
* **Path**: `GET /training/:training_id`
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

### Training Applications (`/training-application`)

#### 1. Submit Application
* **Path**: `POST /training-application/create`
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
* **Path**: `POST /training-application/approve/:student_id/:training_id`
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
* **Path**: `GET /training-application/view`
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

### SuperAdmin Namespace (`/admin`)

#### 1. Admin Dashboard
* **Path**: `GET /admin/dashboard`
* **Auth**: `SuperAdmin` (Role 1)
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Fetched admin dashboard",
    "data": {
      "studentCount": 420,
      "departmentCount": 8,
      "organizationCount": 15,
      "trainingCount": 24,
      "trainingPercentage": 64.51 // Approved applications over total applications
    }
  }
  ```

---

### Metadata Namespaces (Reference Data)

All metadata lists return simple reference objects: `{ <id_name>: number, <value_name>: string }`.

#### 1. Category Table
* **Path**: `GET /category/`
* **Auth**: Public
* **Data Fields**: `category_id`, `category` (e.g. Unreserved, OBC, SC, ST)

#### 2. Department Table
* **Path**: `GET /department/`
* **Auth**: Public
* **Data Fields**: `department_id`, `dept_name`, `is_active`

#### 3. Department Dashboard
* **Path**: `GET /department/dashboard`
* **Auth**: `Coordinator` (Role 3)
* **Warning**: *See developer warnings section regarding severe logic issues with this endpoint.*
* **Success Response (Status: 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Fetched depratment dashboard",
    "data": {
      "studentCount": 82,
      "organizationList": [ ... ],
      "applicationCount": 150,
      "trainingPercentage": 75.00
    }
  }
  ```

#### 4. Division Table
* **Path**: `GET /division/`
* **Auth**: Public
* **Data Fields**: `division_id`, `division` (e.g. Distinction, First, Second)

#### 5. Gender Table
* **Path**: `GET /gender/`
* **Auth**: Public
* **Data Fields**: `gender_id`, `gender` (e.g. Male, Female, Other)

#### 6. Semester Table
* **Path**: `GET /semester/`
* **Auth**: Public
* **Data Fields**: `semester_id`, `semester` (e.g. Sem 1, Sem 2...)

#### 7. Skill Table
* **Path**: `GET /skill/`
* **Auth**: Public
* **Data Fields**: `skill_id`, `skill` (e.g. TypeScript, React, Python)

---

## 6. Critical Integration & Backend Bug Warnings

During review of the backend code, **three remaining logical bugs** were identified. Front-end developers should be aware of these as they will result in runtime errors and API failures:

### 1. Admin Student-Update Route Always Fails (404)
* **Endpoint**: `PUT /student/update/:id`
* **Issue**: The route expects a parameter `:id`, but the controller and service (`updateStudentAdminService`) completely ignore it. Instead, the backend retrieves the student profile using the email of the *authenticating actor* (`actor.auth_email`). Since the actor is a `SuperAdmin` (and does not exist in the `student_table`), the database query returns null.
* **Impact**: Admin attempting to update any student profile will always receive `404 Student not found`.
* **Suggested Fix**: Modify `updateStudentAdminService` to take the target `student_id` (from `req.params.id`) and execute update operations on that ID.

### 2. Coordinator Department Dashboard Maps User ID to Department ID
* **Endpoint**: `GET /department/dashboard`
* **Issue**: The controller calls `Department.getDashboard(actor.auth_user_id)`, passing the coordinator's **user_id** as the **department_id**.
* **Impact**: If a coordinator has user ID 15, the dashboard tries to query metrics for department ID 15. If department 15 does not exist, or if the coordinator belongs to department 2, the data returned will be incorrect or blank.
* **Suggested Fix**: Coordinators should have a department profile reference, or the department_id should be supplied as a path parameter.

### 3. Placements Module is Completely Missing
* **Issue**: While the Database schema contains tables for placements (`placement_table`, `placement_application_table`, `placement_category_table`, etc.) and the codebase has corresponding model files, **no placement routes** are imported, configured, or mounted in `src/app.ts`.
* **Impact**: The Placement features are currently non-functional and inaccessible from the frontend.
