const Task = require('../models/Task');
const FolderAccess = require('../models/FolderAccess');
const Contributor = require('../models/Contributor');
const { sendFolderAccessNotification } = require('../services/notificationService');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Get the folder path for a specific task (Contributor or Admin only)
exports.getTaskFolder = async (req, res) => {
  const { taskId } = req.params;
  const { id: contributorId, role } = req.user;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is assigned to the task or is an Admin
    if (role !== 'Admin' && String(task.assignedTo) !== String(contributorId)) {
      return res.status(403).json({ message: 'Access denied: You are not assigned to this task' });
    }

    // Log folder access
    await FolderAccess.create({
      folderPath: task.folderPath,
      accessedBy: contributorId,
    });

    // Log the access action
    logger.info(`Folder accessed by user: ${contributorId} for task: ${taskId}`);

    // Notify the contributor
    if (role === 'Contributor') {
      const contributor = await Contributor.findById(contributorId);
      if (contributor) {
        await sendFolderAccessNotification(contributor.username, task.folderPath);
      }
    }

    res.status(200).json({ folderPath: task.folderPath });
  } catch (error) {
    logger.error(`Error in getTaskFolder: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// List all folder accesses with optional filters (Admin only)
exports.getFolderAccessLogs = async (req, res) => {
  const { username, folderPath } = req.query; // Optional filters

  try {
    const filter = {};
    if (username) {
      const contributor = await Contributor.findOne({ username });
      if (contributor) {
        filter.accessedBy = contributor._id;
      }
    }
    if (folderPath) filter.folderPath = folderPath;

    const logs = await FolderAccess.find(filter)
      .populate('accessedBy', 'username role') // Populate contributor details
      .sort({ accessedAt: -1 }); // Sort by most recent access first

    res.status(200).json(logs);
  } catch (error) {
    logger.error(`Error in getFolderAccessLogs: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Revoke folder access for a specific task (Admin only)
exports.revokeFolderAccess = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove task-assigned contributor
    task.assignedTo = null;
    await task.save();

    logger.info(`Folder access revoked for task: ${taskId}`);
    res.status(200).json({ message: 'Folder access revoked successfully' });
  } catch (error) {
    logger.error(`Error in revokeFolderAccess: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Assign folder access to a specific contributor for a task (Admin or ProjectManager only)
exports.assignFolderAccess = async (req, res) => {
  const { taskId } = req.params;
  const { contributorId } = req.body;

  try {
    const task = await Task.findById(taskId);
    const contributor = await Contributor.findById(contributorId);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!contributor) return res.status(404).json({ message: 'Contributor not found' });

    // Assign the folder to the contributor
    task.assignedTo = contributor._id;
    await task.save();

    // Notify the contributor
    await sendFolderAccessNotification(contributor.username, task.folderPath);

    logger.info(`Folder access assigned to user: ${contributorId} for task: ${taskId}`);
    res.status(200).json({ message: 'Folder access assigned successfully', task, contributor });
  } catch (error) {
    logger.error(`Error in assignFolderAccess: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Check if a contributor has access to a folder
exports.checkFolderAccess = async (req, res) => {
  const { taskId } = req.params;
  const { id: contributorId, role } = req.user;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const hasAccess = role === 'Admin' || String(task.assignedTo) === String(contributorId);

    res.status(200).json({ hasAccess });
  } catch (error) {
    logger.error(`Error in checkFolderAccess: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Preview files in a folder (Admin or Assigned Contributor only)
exports.previewFolderContents = async (req, res) => {
  const { taskId } = req.params;
  const { id: contributorId, role } = req.user;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access
    if (role !== 'Admin' && String(task.assignedTo) !== String(contributorId)) {
      return res.status(403).json({ message: 'Access denied: You are not assigned to this task' });
    }

    // Get folder path
    const folderPath = task.folderPath;
    const folderContents = fs.readdirSync(folderPath).map((file) => ({
      fileName: file,
      filePath: path.join(folderPath, file),
    }));

    res.status(200).json({ folderContents });
  } catch (error) {
    logger.error(`Error in previewFolderContents: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Schedule access revocation for a task folder
exports.scheduleFolderAccessRevocation = async (req, res) => {
  const { taskId } = req.params;
  const { revokeDate } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Validate the date
    const revocationDate = new Date(revokeDate);
    if (isNaN(revocationDate.getTime())) {
      return res.status(400).json({ message: 'Invalid revocation date' });
    }

    // Schedule revocation (Example: Use a cron job or setTimeout)
    const currentDate = new Date();
    const delay = revocationDate - currentDate;

    if (delay > 0) {
      setTimeout(async () => {
        task.assignedTo = null;
        await task.save();
        logger.info(`Folder access revoked for task: ${taskId} on ${revocationDate}`);
      }, delay);
    }

    res.status(200).json({ message: `Folder access revocation scheduled for ${revokeDate}` });
  } catch (error) {
    logger.error(`Error in scheduleFolderAccessRevocation: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
