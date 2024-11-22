/**
 * taskSeeds.js
 * Aggregates predefined tasks from templates for seeding the database.
 * These tasks include authentication, contributor management, engineer operations, and integrations.
 */

const authenticationTasks = require("../tasks/templates/authenticationTasks");
const userManagementTasks = require("../tasks/templates/userManagementTasks");
const contributorManagementTasks = require("../tasks/templates/contributorManagementTasks");
const engineerManagementTasks = require("../tasks/templates/engineerManagementTasks");
const taskManagementTasks = require("../tasks/templates/taskManagementTasks");
const rewardTasks = require("../tasks/templates/rewardTasks");
const folderManagementTasks = require("../tasks/templates/folderManagementTasks");
const analyticsTasks = require("../tasks/templates/analyticsTasks");
const deploymentTasks = require("../tasks/templates/deploymentTasks");
const frontendUITasks = require("../tasks/templates/frontendUITasks");
const integrationTasks = require("../tasks/templates/integrationTasks");
const generalTasks = require("../tasks/templates/generalTasks");

// Combine all tasks into a single array for database seeding
const allTasks = [
  ...authenticationTasks,
  ...userManagementTasks,
  ...contributorManagementTasks,
  ...engineerManagementTasks,
  ...taskManagementTasks,
  ...rewardTasks,
  ...folderManagementTasks,
  ...analyticsTasks,
  ...deploymentTasks,
  ...frontendUITasks,
  ...integrationTasks,
  ...generalTasks,
];

module.exports = allTasks;
