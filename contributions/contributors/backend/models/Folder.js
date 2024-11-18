const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Contributor", required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    accessLogs: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Contributor" },
        accessedAt: { type: Date, default: Date.now },
      },
    ],
    isShared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Method to add a task to the folder
folderSchema.methods.addTask = function (taskId) {
  this.tasks.push(taskId);
  return this.save();
};

// Method to log folder access
folderSchema.methods.logAccess = function (userId) {
  this.accessLogs.push({ userId, accessedAt: new Date() });
  return this.save();
};

module.exports = mongoose.model("Folder", folderSchema);
