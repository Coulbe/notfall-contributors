const Task = require('../models/Task');
const Contributor = require('../models/Contributor');

// Get all tasks (Admin or Project Manager only)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'username role') // Populate contributor details
      .select('-__v'); // Exclude version key
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'username role') // Populate contributor details
      .populate('dependencies', 'title status'); // Populate dependent tasks

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task (Admin or Project Manager only)
exports.createTask = async (req, res) => {
  const { title, description, folderPath, priority, dependencies } = req.body;

  try {
    const newTask = await Task.create({
      title,
      description,
      folderPath,
      priority,
      dependencies,
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task details (Admin or Project Manager only)
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task status (Contributor, Admin, or Project Manager)
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure only assigned contributors, admins, or project managers can update status
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'ProjectManager' &&
      String(task.assignedTo) !== String(req.user.id)
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: `Task status updated to ${status}`, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task (Admin only)
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a task to a contributor (Admin or Project Manager only)
exports.assignTaskToContributor = async (req, res) => {
  const { taskId } = req.params;
  const { contributorId } = req.body;

  try {
    const task = await Task.findById(taskId);
    const contributor = await Contributor.findById(contributorId);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!contributor) return res.status(404).json({ message: 'Contributor not found' });

    // Ensure the task is not already assigned
    if (task.assignedTo && String(task.assignedTo) !== String(contributor._id)) {
      return res.status(400).json({ message: 'Task is already assigned to another contributor' });
    }

    task.assignedTo = contributor._id;
    await task.save();

    // Update contributor's task list
    if (!contributor.tasks.includes(task._id)) {
      contributor.tasks.push(task._id);
      await contributor.save();
    }

    res.status(200).json({ message: 'Task assigned successfully', task, contributor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks assigned to the logged-in contributor
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('dependencies', 'title status') // Populate dependent tasks
      .select('-__v'); // Exclude version key

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
