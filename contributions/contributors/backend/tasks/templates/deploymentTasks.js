/**
 * templates/deploymentTasks.js
 * Tasks for setting up CI/CD pipelines and cloud deployment processes.
 */

const deploymentTasks = [
  {
    title: "Setup CI/CD Pipeline",
    description: "Configure a CI/CD pipeline for backend and frontend deployments.",
    role: "DevOps Engineer",
    folderAccess: [
      "backend/.github/workflows",
      "frontend/.github/workflows",
    ],
    reward: 40,
    priority: "High",
    tags: ["devops", "CI/CD", "automation"],
    status: "Unassigned",
  },
  {
    title: "Containerise Backend Service",
    description: "Use Docker to containerize the backend for scalable deployments.",
    role: "DevOps Engineer",
    folderAccess: ["backend/Dockerfile", "backend/docker-compose.yml"],
    reward: 30,
    priority: "High",
    tags: ["devops", "docker", "backend"],
    status: "Unassigned",
  },
];

module.exports = deploymentTasks;
