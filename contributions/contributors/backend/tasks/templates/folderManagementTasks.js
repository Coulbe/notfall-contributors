/**
 * templates/folderManagementTasks.js
 * Predefined tasks for managing folders, file access, and permissions.
 */

const folderManagementTasks = [
  {
    title: "Folder Access API",
    description: "Develop an API to manage folder access permissions for contributors.",
    role: "Backend Developer",
    folderAccess: [
      "backend/controllers/folderController.js",
      "backend/models/Folder.js",
    ],
    reward: 20,
    priority: "High",
    tags: ["backend", "API", "folders"],
    status: "Unassigned",
  },
  {
    title: "Folder Tree UI",
    description: "Create a folder tree UI component for navigating folder structures.",
    role: "Frontend Developer",
    folderAccess: ["frontend/src/components/folders/FolderTree.jsx"],
    reward: 25,
    priority: "Medium",
    tags: ["frontend", "UI", "folders"],
    status: "Unassigned",
  },
];

module.exports = folderManagementTasks;
