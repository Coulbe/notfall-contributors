# 📑 Notfall Engineers On-Demand API Documentation

## Base URL
`https://api.notfallengineers.com/v1`

---

## Table of Contents
1. **User Authentication**
    - `POST /auth/register`
    - `POST /auth/login`
2. **Dashboard Layout Customization**
    - `GET /dashboard/layout`
    - `POST /dashboard/layout`
3. **Location Preferences**
    - `GET /engineers/:id/locations`
    - `POST /engineers/:id/locations`
4. **Task Assignment**
    - `POST /tasks`
    - `GET /tasks/available`
5. **Engineer Availability**
    - `PATCH /engineers/:id/availability`
    - `GET /engineers/:id/availability`

---

## 1. User Authentication

### `POST /auth/register`
Registers a new user or engineer.

- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
    ```json
    {
      "username": "johndoe",
      "email": "john.doe@example.com",
      "password": "securepassword123",
      "role": "engineer"
    }
    ```
- **Response**:
    ```json
    {
      "message": "User registered successfully",
      "userId": "60d0fe4f5311236168a109ca"
    }
    ```
- **Errors**:
    - `400 Bad Request`: Validation error, such as missing fields.
    - `409 Conflict`: Email already registered.

### `POST /auth/login`
Logs in an existing user or engineer.

- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
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

---

## 2. Dashboard Layout Customization

### `GET /dashboard/layout`
Fetches the user’s customized dashboard layout.

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
- **Errors**:
    - `401 Unauthorized`: Missing or invalid token.

### `POST /dashboard/layout`
Saves the user’s customized dashboard layout.

- **Endpoint**: `/dashboard/layout`
- **Method**: `POST`
- **Authentication**: Bearer token required
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
    - `400 Bad Request`: Invalid layout format.
    - `401 Unauthorized`: Missing or invalid token.

---

## 3. Location Preferences

### `GET /engineers/:id/locations`
Retrieves an engineer’s preferred service locations.

- **Endpoint**: `/engineers/:id/locations`
- **Method**: `GET`
- **Authentication**: Bearer token required
- **Path Parameters**:
    - `id` (string): Engineer ID.
- **Response**:
    ```json
    {
      "locations": [
        { "area": "London", "coordinates": [[51.5074, -0.1278]] },
        { "area": "Cambridge", "coordinates": [[52.2053, 0.1218]] }
      ]
    }
    ```
- **Errors**:
    - `404 Not Found`: Engineer not found.

### `POST /engineers/:id/locations`
Sets or updates an engineer’s preferred service locations.

- **Endpoint**: `/engineers/:id/locations`
- **Method**: `POST`
- **Authentication**: Bearer token required
- **Path Parameters**:
    - `id` (string): Engineer ID.
- **Request Body**:
    ```json
    {
      "locations": [
        { "area": "London", "coordinates": [[51.5074, -0.1278]] },
        { "area": "Cambridge", "coordinates": [[52.2053, 0.1218]] }
      ]
    }
    ```
- **Response**:
    ```json
    {
      "message": "Locations updated successfully"
    }
    ```
- **Errors**:
    - `400 Bad Request`: Invalid location format.
    - `401 Unauthorized`: Missing or invalid token.

---

## 4. Task Assignment

### `POST /tasks`
Creates a new task with a specific location and requirements.

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
- **Errors**:
    - `400 Bad Request`: Missing or invalid data fields.
    - `401 Unauthorized`: Missing or invalid token.

### `GET /tasks/available`
Fetches available tasks within an engineer’s service area.

- **Endpoint**: `/tasks/available`
- **Method**: `GET`
- **Authentication**: Bearer token required (Engineer)
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
    - `401 Unauthorized`: Missing or invalid token.

---

## 5. Engineer Availability

### `PATCH /engineers/:id/availability`
Updates an engineer’s availability status.

- **Endpoint**: `/engineers/:id/availability`
- **Method**: `PATCH`
- **Authentication**: Bearer token required
- **Path Parameters**:
    - `id` (string): Engineer ID.
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
- **Errors**:
    - `400 Bad Request`: Invalid availability status.
    - `401 Unauthorized`: Missing or invalid token.

### `GET /engineers/:id/availability`
Fetches an engineer’s current availability status.

- **Endpoint**: `/engineers/:id/availability`
- **Method**: `GET`
- **Authentication**: Bearer token required
- **Path Parameters**:
    - `id` (string): Engineer ID.
- **Response**:
    ```json
    {
      "available": true
    }
    ```
- **Errors**:
    - `404 Not Found`: Engineer not found.
