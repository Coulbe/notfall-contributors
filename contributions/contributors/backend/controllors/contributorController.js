const Contributor = require('../models/Contributor');
const Task = require('../models/Task');

// Get all contributors with optional filters and search (Admin or ProjectManager only)
exports.getAllContributors = async (req, res) => {
  const { search, role } = req.query; // Optional query parameters
  try {
    // Build dynamic filter object
    const filter = {};
    if (role) filter.role = role; // Filter by role
    if (search) {
      filter.username = { $regex: search, $options: 'i' }; // Case-insensitive search by username
    }

    const contributors = await Contributor.find(filter).select('-__v'); // Exclude version key
    res.status(200).json(contributors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single contributor by ID with detailed stats (Self or Admin/ProjectManager access)
exports.getContributorById = async (req, res) => {
  const { contributorId } = req.params;
  const requester = req.user;

  try {
    const contributor = await Contributor.findById(contributorId)
      .populate('tasks', 'title status folderPath') // Populate task details
      .select('-__v'); // Exclude version key

    if (!contributor) return res.status(404).json({ message: 'Contributor not found' });

    // Self-access or Admin/Manager access
    if (String(contributor._id) !== String(requester.id) && requester.role !== 'Admin' && requester.role !== 'ProjectManager') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(contributor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new contributor with initial task assignment (Admin only)
exports.createContributor = async (req, res) => {
  const { username, role, initialTaskId } = req.body;

  try {
    const existingContributor = await Contributor.findOne({ username });
    if (existingContributor) return res.status(400).json({ message: 'Contributor already exists' });

    const newContributor = new Contributor({ username, role });

    // Optionally assign an initial task
    if (initialTaskId) {
      const task = await Task.findById(initialTaskId);
      if (!task) return res.status(404).json({ message: 'Initial task not found' });

      task.assignedTo = newContributor._id;
      await task.save();

      newContributor.tasks.push(task._id);
    }

    await newContributor.save();
    res.status(201).json(newContributor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contributor details (Admin only)
exports.updateContributor = async (req, res) => {
  const { contributorId } = req.params;
  const updates = req.body;

  try {
    const contributor = await Contributor.findByIdAndUpdate(contributorId, updates, { new: true });
    if (!contributor) return res.status(404).json({ message: 'Contributor not found' });

    res.status(200).json(contributor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign multiple tasks to a contributor (Admin or ProjectManager only)
exports.assignMultipleTasks = async (req, res) => {
  const { contributorId } = req.params;
  const { taskIds } = req.body;

  try {
    const contributor = await Contributor.findById(contributorId);
    if (!contributor) return res.status(404).json({ message: 'Contributor not found' });

    const tasks = await Task.find({ _id: { $in: taskIds } });

    if (tasks.length !== taskIds.length) {
      return res.status(404).json({ message: 'One or more tasks not found' });
    }

    // Assign tasks and update contributor
    tasks.forEach((task) => {
      if (!task.assignedTo) {
        task.assignedTo = contributor._id;
        contributor.tasks.push(task._id);
      }
    });

    await Promise.all(tasks.map((task) => task.save()));
    await contributor.save();

    res.status(200).json({ message: 'Tasks assigned successfully', tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get contributors by recent activity (Admin or ProjectManager only)
exports.getActiveContributors = async (req, res) => {
  const { days } = req.query;

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (days || 30)); // Default to 30 days

    const contributors = await Contributor.find({ lastActive: { $gte: cutoffDate } })
      .select('username role lastActive')
      .sort({ lastActive: -1 });

    res.status(200).json(contributors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log contributor activity
exports.logActivity = async (req, res) => {
  const { contributorId } = req.params;
  const { activity } = req.body;

  try {
    const contributor = await Contributor.findById(contributorId);

    if (!contributor) return res.status(404).json({ message: 'Contributor not found' });

    contributor.activityLog.push({ activity, date: new Date() });
    contributor.lastActive = new Date();
    await contributor.save();

    res.status(200).json({ message: 'Activity logged successfully', contributor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a contributor (Admin only)
exports.deleteContributor = async (req, res) => {
  const { contributorId } = req.params;

  try {
    const contributor = await Contributor.findByIdAndDelete(contributorId);
    if (!contributor) return res.status(404).json({ message: 'Contributor not found' });

    // Optionally unassign tasks
    await Task.updateMany({ assignedTo: contributorId }, { $unset: { assignedTo: '' } });

    res.status(200).json({ message: 'Contributor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
