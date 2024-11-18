const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Contributor" },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

// Method to update task status
taskSchema.methods.updateStatus = function (status) {
  this.status = status;
  return this.save();
};

// Static method to find tasks by status
taskSchema.statics.findByStatus = function (status) {
  return this.find({ status });
};

module.exports = mongoose.model("Task", taskSchema);
