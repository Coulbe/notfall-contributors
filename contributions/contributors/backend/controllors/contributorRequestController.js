/**
 * controllers/contributorRequestController.js
 * Handles CRUD operations for contributor requests, GitHub integration, and real-time notifications.
 */

const ContributorRequest = require("../models/ContributorRequest");
const githubService = require("../services/githubService");
const notificationService = require("../services/realTimeNotification");
const logger = require("../utils/logger");

/**
 * Fetch all contributor requests.
 * @route GET /api/contributor-requests
 * @access Admin
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ContributorRequest.find()
      .sort({ submittedAt: -1 }) // Sort by submission date (newest first)
      .populate("reviewer", "username email"); // Populate reviewer details

    res.status(200).json({ requests });
  } catch (error) {
    logger.error(`Error fetching contributor requests: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch contributor requests." });
  }
};

/**
 * Fetch a single contributor request by ID.
 * @route GET /api/contributor-requests/:id
 * @access Admin
 */
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ContributorRequest.findById(id).populate("reviewer", "username email");

    if (!request) {
      return res.status(404).json({ message: "Contributor request not found." });
    }

    res.status(200).json({ request });
  } catch (error) {
    logger.error(`Error fetching contributor request by ID: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch contributor request." });
  }
};

/**
 * Create a new contributor request.
 * @route POST /api/contributor-requests
 * @access Public
 */
exports.createRequest = async (req, res) => {
  try {
    const newRequest = new ContributorRequest(req.body);
    await newRequest.save();

    logger.info(`Contributor request created: ${newRequest.githubUsername}`);

    // Send a notification to the admin about the new request
    notificationService.sendNotification({
      recipient: "admin",
      title: "New Contributor Request",
      message: `A new contributor request has been submitted by ${newRequest.githubUsername}.`,
    });

    res.status(201).json({
      message: "Contributor request submitted successfully.",
      request: newRequest,
    });
  } catch (error) {
    logger.error(`Error creating contributor request: ${error.message}`);
    res.status(500).json({ message: "Failed to submit contributor request." });
  }
};

/**
 * Approve a contributor request and add the contributor to GitHub.
 * @route PUT /api/contributor-requests/:id/approve
 * @access Admin
 */
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ContributorRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Contributor request not found." });
    }

    try {
      // Add the contributor as a collaborator on GitHub
      await githubService.addCollaborator(request.githubUsername);

      request.status = "Approved";
      request.reviewer = req.user.id; // Assign the admin who approved the request
      await request.save();

      // Notify the contributor about approval
      notificationService.sendNotification({
        recipient: request.githubUsername,
        title: "Contributor Request Approved",
        message: "Your request has been approved. You now have access to the repository.",
      });

      logger.info(`Contributor request approved: ${request.githubUsername}`);
      res.status(200).json({
        message: "Contributor request approved and added to GitHub.",
        request,
      });
    } catch (error) {
      logger.error(`GitHub integration failed for ${request.githubUsername}: ${error.message}`);
      res.status(500).json({ message: "Failed to approve contributor request due to GitHub error." });
    }
  } catch (error) {
    logger.error(`Error approving contributor request: ${error.message}`);
    res.status(500).json({ message: "Failed to approve contributor request." });
  }
};

/**
 * Reject a contributor request with a reason.
 * @route PUT /api/contributor-requests/:id/reject
 * @access Admin
 */
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = await ContributorRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Contributor request not found." });
    }

    request.status = "Rejected";
    request.reviewer = req.user.id;
    request.rejectionReason = reason || "No reason provided.";
    await request.save();

    // Notify the contributor about rejection
    notificationService.sendNotification({
      recipient: request.githubUsername,
      title: "Contributor Request Rejected",
      message: `Your request was rejected. Reason: ${request.rejectionReason}`,
    });

    logger.info(`Contributor request rejected: ${request.githubUsername}`);
    res.status(200).json({
      message: "Contributor request rejected.",
      request,
    });
  } catch (error) {
    logger.error(`Error rejecting contributor request: ${error.message}`);
    res.status(500).json({ message: "Failed to reject contributor request." });
  }
};

/**
 * Delete a contributor request.
 * @route DELETE /api/contributor-requests/:id
 * @access Admin
 */
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ContributorRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({ message: "Contributor request not found." });
    }

    logger.info(`Contributor request deleted: ${request.githubUsername}`);
    res.status(200).json({ message: "Contributor request deleted successfully." });
  } catch (error) {
    logger.error(`Error deleting contributor request: ${error.message}`);
    res.status(500).json({ message: "Failed to delete contributor request." });
  }
};
