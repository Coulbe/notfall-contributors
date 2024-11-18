const Contributor = require("../models/Contributor");
const Contribution = require("../models/Contribution");
const Task = require("../models/Task");
const { assignBadges } = require("./gamificationController");
const { sendNotification } = require("../services/notificationService");

/**
 * Get all contributors with optional filters and search (Admin or ProjectManager only).
 */
exports.getAllContributors = async (req, res) => {
  const { search, role } = req.query;

  try {
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.username = { $regex: search, $options: "i" };
    }

    const contributors = await Contributor.find(filter).select("-__v");
    res.status(200).json(contributors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contributors", error: error.message });
  }
};

/**
 * Get contributor by ID with detailed stats (Self or Admin/ProjectManager access).
 */
exports.getContributorById = async (req, res) => {
  const { contributorId } = req.params;
  const requester = req.user;

  try {
    const contributor = await Contributor.findById(contributorId)
      .populate("tasks", "title status folderPath")
      .populate("contributions", "description category subcategory")
      .select("-__v");

    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    if (
      String(contributor._id) !== String(requester.id) &&
      !["Admin", "ProjectManager"].includes(requester.role)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(contributor);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contributor", error: error.message });
  }
};

/**
 * Create a new contributor with optional initial task assignment (Admin only).
 */
exports.createContributor = async (req, res) => {
  const { username, email, role, walletAddress, initialTaskId } = req.body;

  try {
    const existingContributor = await Contributor.findOne({ email });
    if (existingContributor) return res.status(400).json({ message: "Contributor already exists" });

    const newContributor = new Contributor({
      username,
      email,
      role,
      wallet: { address: walletAddress },
    });

    if (initialTaskId) {
      const task = await Task.findById(initialTaskId);
      if (!task) return res.status(404).json({ message: "Initial task not found" });

      task.assignedTo = newContributor._id;
      await task.save();

      newContributor.tasks.push(task._id);
    }

    await newContributor.save();
    res.status(201).json({ message: "Contributor created successfully", contributor: newContributor });
  } catch (error) {
    res.status(500).json({ message: "Failed to create contributor", error: error.message });
  }
};

/**
 * Update contributor details (Admin only).
 */
exports.updateContributor = async (req, res) => {
  const { contributorId } = req.params;
  const updates = req.body;

  try {
    const contributor = await Contributor.findByIdAndUpdate(contributorId, updates, { new: true });
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    res.status(200).json({ message: "Contributor updated successfully", contributor });
  } catch (error) {
    res.status(500).json({ message: "Failed to update contributor", error: error.message });
  }
};

/**
 * Assign multiple tasks to a contributor (Admin or ProjectManager only).
 */
exports.assignMultipleTasks = async (req, res) => {
  const { contributorId } = req.params;
  const { taskIds } = req.body;

  try {
    const contributor = await Contributor.findById(contributorId);
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    const tasks = await Task.find({ _id: { $in: taskIds } });

    if (tasks.length !== taskIds.length) {
      return res.status(404).json({ message: "One or more tasks not found" });
    }

    tasks.forEach((task) => {
      if (!task.assignedTo) {
        task.assignedTo = contributor._id;
        contributor.tasks.push(task._id);
      }
    });

    await Promise.all(tasks.map((task) => task.save()));
    await contributor.save();

    res.status(200).json({ message: "Tasks assigned successfully", tasks });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign tasks", error: error.message });
  }
};

/**
 * Log contributor activity.
 */
exports.logActivity = async (req, res) => {
  const { contributorId } = req.params;
  const { activity } = req.body;

  try {
    const contributor = await Contributor.findById(contributorId);
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    contributor.activityLog.push({ activity, date: new Date() });
    contributor.lastActive = new Date();
    await contributor.save();

    res.status(200).json({ message: "Activity logged successfully", contributor });
  } catch (error) {
    res.status(500).json({ message: "Failed to log activity", error: error.message });
  }
};

/**
 * Assign badges to a contributor based on contributions.
 */
exports.assignBadgesToContributor = async (req, res) => {
  const { contributorId } = req.params;

  try {
    const contributor = await Contributor.findById(contributorId).populate("contributions");
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    const badges = await assignBadges(contributor);
    res.status(200).json({ message: "Badges assigned successfully", badges });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign badges", error: error.message });
  }
};

/**
 * Delete a contributor (Admin only).
 */
exports.deleteContributor = async (req, res) => {
  const { contributorId } = req.params;

  try {
    const contributor = await Contributor.findByIdAndDelete(contributorId);
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    await Task.updateMany({ assignedTo: contributorId }, { $unset: { assignedTo: "" } });

    res.status(200).json({ message: "Contributor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contributor", error: error.message });
  }
};

