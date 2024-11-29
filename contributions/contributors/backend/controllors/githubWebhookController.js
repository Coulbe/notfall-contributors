/**
 * controllers/githubWebhookController.js
 * Handles incoming GitHub webhooks for events such as pull requests and issue updates.
 */

const logger = require("../utils/logger");

/**
 * Handle GitHub webhook events.
 * @route POST /api/github/webhooks
 * @access Public
 */
exports.handleWebhookEvent = async (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  try {
    if (event === "pull_request") {
      logger.info(`Pull request event received: ${payload.action}`);
      // Handle pull request actions (opened, closed, merged)
    } else if (event === "issues") {
      logger.info(`Issue event received: ${payload.action}`);
      // Handle issue actions (opened, closed, edited)
    }

    res.status(200).json({ message: "Webhook event processed." });
  } catch (error) {
    logger.error(`Error processing GitHub webhook: ${error.message}`);
    res.status(500).json({ message: "Failed to process webhook event." });
  }
};
