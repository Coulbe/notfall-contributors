docs/# Task Assignment Guide

This document provides a comprehensive guide on how tasks are created, assigned, and tracked within the **Notfall Contributors System**.

---

## 🌟 Overview of Task Assignment

Tasks are dynamically assigned to contributors based on:
- **Roles**: Backend Developer, Frontend Developer, Blockchain Developer, etc.
- **Expertise**: Matching contributor skills to task requirements.
- **Folder Access**: Ensuring contributors can only access relevant folders/files.
- **Priority**: Assigning high-priority tasks to experienced contributors.
- **Availability**: Distributing workload evenly among contributors.

---

## 🛠️ Workflow of Task Assignment

1. **Task Creation**:
   - Tasks are predefined in the `seeds/taskSeeds.js` file or dynamically created by admins via the Admin Dashboard.
   - Task metadata includes:
     - `title`, `description`, `priority`, `dueDate`, `role`, `tags`, and `folderAccess`.

2. **Dynamic Matching**:
   - The system uses the `taskMatchingService.js` to assign tasks:
     - Matches the contributor's role and expertise with task requirements.
     - Checks availability and current workload to balance task distribution.

3. **Folder Access**:
   - Assigned tasks grant contributors access to specific folders/files:
     - Example: A backend developer working on authentication will access:
       - `backend/controllers/authController.js`
       - `backend/middleware/authMiddleware.js`.

4. **Notification**:
   - Contributors are notified of new assignments via the `notificationService.js`:
     - Real-time notifications are sent to contributors with task details.

5. **Tracking**:
   - Contributors track tasks via the Contributor Dashboard:
     - View `status`, `priority`, `dueDate`, and `reward`.

---

## 📝 Task Metadata

Each task includes the following fields:

| **Field**         | **Description**                                                                             |
|--------------------|---------------------------------------------------------------------------------------------|
| `title`           | The name of the task (e.g., "Implement Login API").                                         |
| `description`     | A detailed explanation of the task requirements.                                           |
| `role`            | The role required to complete the task (e.g., Backend Developer, Frontend Developer).       |
| `folderAccess`    | A list of folders/files accessible to the contributor for this task.                        |
| `priority`        | Task priority level: `Low`, `Medium`, `High`.                                               |
| `status`          | The current status: `Unassigned`, `In Progress`, `Completed`, `Archived`.                   |
| `reward`          | The number of Notcoins or points awarded upon task completion.                              |
| `tags`            | Keywords for categorisation (e.g., "authentication", "API", "security").                    |
| `dueDate`         | The deadline for task completion (optional).                                                |
| `assignedTo`      | The ID of the contributor assigned to the task (if assigned).                               |

---

## 🎯 Task Assignment Logic

The **Task Assignment Logic** is implemented in `backend/services/taskMatchingService.js`. The key steps include:

1. **Retrieve Unassigned Tasks**:
   ```javascript
   const unassignedTasks = await Task.find({ status: "Unassigned" });
