/**
 * templates/generalTasks.js
 * Miscellaneous tasks not falling under specific categories.
 */

const generalTasks = [
  {
    title: "Documentation",
    description: "Write comprehensive documentation for the Notfall platform.",
    role: "Technical Writer",
    folderAccess: ["README.md"],
    reward: 15,
    priority: "Medium",
    tags: ["documentation"],
    status: "Unassigned",
  },
  {
    title: "Setup CI/CD Pipeline",
    description: "Configure a CI/CD pipeline for automated builds and deployments.",
    role: "DevOps Engineer",
    folderAccess: [
      "backend/.github/workflows",
      "frontend/.github/workflows",
    ],
    reward: 40,
    priority: "High",
    tags: ["devops", "automation", "CI/CD"],
    status: "Unassigned",
  },
];

module.exports = generalTasks;
