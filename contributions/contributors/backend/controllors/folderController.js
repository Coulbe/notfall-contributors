const Contributor = require("../models/Contributor");
const Task = require("../models/Task");
const Folder = require("../models/Folder");

/**
 * Create a new folder.
 */
exports.createFolder = async (req, res) => {
  const { name, contributorId, parentFolderId } = req.body;

  try {
    const contributor = await Contributor.findById(contributorId);
    if (!contributor) return res.status(404).json({ message: "Contributor not found" });

    const parentFolder = parentFolderId ? await Folder.findById(parentFolderId) : null;
    if (parentFolderId && !parentFolder) {
      return res.status(404).json({ message: "Parent folder not found" });
    }

    const newFolder = new Folder({
      name,
      owner: contributorId,
      parentFolder: parentFolderId || null,
    });

    await newFolder.save();

    res.status(201).json({
      message: "Folder created successfully",
      folder: {
        id: newFolder._id,
        name: newFolder.name,
        owner: newFolder.owner,
        parentFolder: parentFolder ? parentFolder.name : null,
        createdAt: newFolder.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create folder", error: error.message });
  }
};

/**
 * Get all folders for a contributor.
 */
exports.getContributorFolders = async (req, res) => {
  const { contributorId } = req.params;

  try {
    const folders = await Folder.find({ owner: contributorId }).populate("parentFolder");

    if (folders.length === 0) {
      return res.status(404).json({ message: "No folders found for this contributor" });
    }

    const formattedFolders = folders.map((folder) => ({
      id: folder._id,
      name: folder.name,
      parentFolder: folder.parentFolder ? folder.parentFolder.name : null,
      createdAt: folder.createdAt,
    }));

    res.status(200).json(formattedFolders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch folders", error: error.message });
  }
};

/**
 * Get detailed folder information, including tasks and nested folders.
 */
exports.getFolderDetails = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await Folder.findById(folderId).populate("parentFolder");
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const tasks = await Task.find({ folder: folderId });
    const nestedFolders = await Folder.find({ parentFolder: folderId });

    res.status(200).json({
      folder: {
        id: folder._id,
        name: folder.name,
        owner: folder.owner,
        parentFolder: folder.parentFolder ? folder.parentFolder.name : null,
        createdAt: folder.createdAt,
      },
      tasks,
      nestedFolders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch folder details", error: error.message });
  }
};

/**
 * Update folder details (e.g., rename).
 */
exports.updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name } = req.body;

  try {
    const folder = await Folder.findByIdAndUpdate(folderId, { name }, { new: true });
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    res.status(200).json({
      message: "Folder updated successfully",
      folder: {
        id: folder._id,
        name: folder.name,
        updatedAt: folder.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update folder", error: error.message });
  }
};

/**
 * Delete a folder and optionally its contents.
 */
exports.deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  const { deleteContents } = req.body; // Boolean flag to delete tasks and nested folders

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (deleteContents) {
      // Delete tasks in the folder
      await Task.deleteMany({ folder: folderId });

      // Recursively delete nested folders
      const nestedFolders = await Folder.find({ parentFolder: folderId });
      for (const nestedFolder of nestedFolders) {
        await this.deleteFolder({ params: { folderId: nestedFolder._id }, body: { deleteContents: true } }, res);
      }
    } else {
      // Unassign tasks in the folder
      await Task.updateMany({ folder: folderId }, { $unset: { folder: "" } });
    }

    await folder.remove();
    res.status(200).json({ message: "Folder and its contents deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete folder", error: error.message });
  }
};

/**
 * Assign a task to a folder.
 */
exports.assignTaskToFolder = async (req, res) => {
  const { folderId, taskId } = req.body;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.folder = folderId;
    await task.save();

    res.status(200).json({
      message: "Task assigned to folder successfully",
      task: {
        id: task._id,
        title: task.title,
        folder: folder.name,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign task to folder", error: error.message });
  }
};

/**
 * Organize tasks in a folder by priority, status, or custom criteria.
 */
exports.organizeTasksInFolder = async (req, res) => {
  const { folderId } = req.params;
  const { sortBy = "status" } = req.query; // Default to sorting by status

  try {
    const tasks = await Task.find({ folder: folderId }).sort({ [sortBy]: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to organize tasks", error: error.message });
  }
};
