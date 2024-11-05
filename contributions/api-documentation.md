# 📑 Notfall Engineers On-Demand - Extended API Documentation

## Base URL
`https://api.notfallengineers.com/v1`

---

## Table of Contents
1. **User Authentication**
    - `POST /auth/register`
    - `POST /auth/login`
    - `POST /auth/logout`
2. **Dashboard Layout Customization**
    - `GET /dashboard/layout`
    - `POST /dashboard/layout`
3. **Location Preferences**
    - `GET /engineers/:id/locations`
    - `POST /engineers/:id/locations`
4. **Task Assignment**
    - `POST /tasks`
    - `GET /tasks/available`
    - `PATCH /tasks/:id/assign`
5. **Engineer Availability**
    - `PATCH /engineers/:id/availability`
    - `GET /engineers/:id/availability`

---

## 1. User Authentication

### `POST /auth/register`
Registers a new user or engineer, validating and storing user credentials securely.

- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
    ```json
    {
      "username": "johndoe",
      "email": "john.doe@example.com",
      "password": "securepassword123",
      "role": "engineer"  // options: 'engineer' or 'user'
    }
    ```
- **Response**:
    ```json
    {
      "message": "User registered successfully",
      "userId": "60d0fe4f5311236168a109ca"
    }
    ```
- **Notes**:
  - **Password Security**: Passwords are encrypted with bcrypt hashing.
  - **Email Uniqueness**: Ensures email uniqueness to prevent duplicate registrations.

### `POST /auth/login`
Logs in an existing user or engineer, generating a JWT for secure session management.

- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securepassword123"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userId": "60d0fe4f5311236168a109ca"
    }
    ```
- **Errors**:
    - `401 Unauthorized`: Invalid email or password.

### `POST /auth/logout`
Logs out the user by invalidating the session token.

- **Endpoint**: `/auth/logout`
- **Method**: `POST`
- **Authentication**: Bearer token required

---

## 2. Dashboard Layout Customization

### `GET /dashboard/layout`
Fetches the user’s current dashboard layout.

- **Endpoint**: `/dashboard/layout`
- **Method**: `GET`
- **Authentication**: Bearer token required
- **Response**:
    ```json
    {
      "layout": [
        { "widget": "tasks", "position": { "x": 0, "y": 0 } },
        { "widget": "notifications", "position": { "x": 1, "y": 0 } }
      ]
    }
    ```
- **Considerations**:
  - **Widget Position Validation**: Each widget position is validated to avoid overlaps.
  - **Default Layout**: A default layout is provided if the user has not customized their dashboard.

### `POST /dashboard/layout`
Updates the user’s customized dashboard layout.

- **Endpoint**: `/dashboard/layout`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "layout": [
        { "widget": "tasks", "position": { "x": 0, "y": 0 } },
        { "widget": "notifications", "position": { "x": 1, "y": 0 } }
      ]
    }
    ```
- **Response**:
    ```json
    {
      "message": "Layout saved successfully"
    }
    ```
- **Errors**:
    - `400 Bad Request`: Invalid layout format or overlapping widgets.

---

## 3. Location Preferences

### `GET /engineers/:id/locations`
Retrieves the engineer’s selected service locations.

- **Endpoint**: `/engineers/:id/locations`
- **Method**: `GET`
- **Authentication**: Bearer token required
- **Response**:
    ```json
    {
      "locations": [
        { "area": "London", "coordinates": [51.5074, -0.1278] },
        { "area": "Cambridge", "coordinates": [52.2053, 0.1218] }
      ]
    }
    ```
- **Notes**:
  - **Location Limits**: Engineers can select up to 3 locations.

### `POST /engineers/:id/locations`
Sets or updates an engineer’s preferred service locations.

- **Endpoint**: `/engineers/:id/locations`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
      "locations": [
        { "area": "London", "coordinates": [51.5074, -0.1278] },
        { "area": "Cambridge", "coordinates": [52.2053, 0.1218] }
      ]
    }
    ```
- **Errors**:
    - `400 Bad Request`: Exceeds 3 locations or invalid coordinates format.

---

## 4. Task Assignment

### `POST /tasks`
Creates a new task with required location and engineer skills.

- **Endpoint**: `/tasks`
- **Method**: `POST`
- **Authentication**: Bearer token required (Admin/User)
- **Request Body**:
    ```json
    {
      "title": "Emergency plumbing repair",
      "location": { "coordinates": [51.5074, -0.1278] },
      "skillsRequired": ["plumbing"],
      "urgency": "high"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Task created successfully",
      "taskId": "60d0fe4f5311236168a109df"
    }
    ```
- **Considerations**:
  - **Urgency Levels**: Supports "low," "medium," and "high."
  - **Skills Validation**: Validates required skills against predefined categories.

### `GET /tasks/available`
Fetches tasks available within an engineer’s service areas.

- **Endpoint**: `/tasks/available`
- **Method**: `GET`
- **Response**:
    ```json
    {
      "tasks": [
        {
          "taskId": "60d0fe4f5311236168a109df",
          "title": "Emergency plumbing repair",
          "location": { "coordinates": [51.5074, -0.1278] },
          "urgency": "high"
        }
      ]
    }
    ```
- **Errors**:
    - `404 Not Found`: No tasks found within service areas.

### `PATCH /tasks/:id/assign`
Assigns a task to a specific engineer, validating against availability and service areas.

- **Endpoint**: `/tasks/:id/assign`
- **Method**: `PATCH`
- **Request Body**:
    ```json
    {
      "engineerId": "60d0fe4f5311236168a109ec"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Task assigned to engineer",
      "taskId": "60d0fe4f5311236168a109df"
    }
    ```
- **Errors**:
    - `409 Conflict`: Engineer not available or outside of service area.

---

## 5. Engineer Availability

### `PATCH /engineers/:id/availability`
Updates an engineer’s availability status in real-time.

- **Endpoint**: `/engineers/:id/availability`
- **Method**: `PATCH`
- **Authentication**: Bearer token required
- **Request Body**:
    ```json
    {
      "available": true
    }
    ```
- **Response**:
    ```json
    {
      "message": "Availability status updated"
    }
    ```
- **Notes**:
  - **Real-Time Updates**: Reflects availability instantly across the platform.

### `GET /engineers/:id/availability`
Checks an engineer’s current availability.

- **Endpoint**: `/engineers/:id/availability`
- **Method**: `GET`
- **Response**:
    ```json
    {
      "available": true
    }
    ```

---

## Security Measures

1. **JWT Authentication**: Each request from authenticated users requires a JWT token in the header.
2. **Role-Based Access Control**: Certain endpoints are restricted by role (Admin, User, Engineer).
3. **Data Validation**: Validations for requests ensure input data is sanitized, such as limiting the number of locations, ensuring coordinates format, and validating task data fields.

---

## Error Codes

| Status Code |

 Description                               |

| 400         | Bad Request - Invalid input or format     |

| 401         | Unauthorized - Missing/invalid token      |

| 403         | Forbidden - Access not allowed for role   |

| 404         | Not Found - Resource not available        |

| 409         | Conflict - Data conflict, e.g., assignment conflict |

| 500         | Server Error - General internal error     |
