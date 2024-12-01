/**
 * Sends a success response.
 * @param {Object} res - Express response object.
 * @param {string} message - Success message.
 * @param {Object} [data={}] - Data payload.
 * @param {number} [status=200] - HTTP status code.
 */
const successResponse = (res, message, data = {}, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };
  
  /**
   * Sends an error response.
   * @param {Object} res - Express response object.
   * @param {string} message - Error message.
   * @param {Object} [error={}] - Error payload.
   * @param {number} [status=500] - HTTP status code.
   */
  const errorResponse = (res, message, error = {}, status = 500) => {
    return res.status(status).json({
      success: false,
      message,
      error,
    });
  };
  
  /**
   * Sends a paginated response for large datasets.
   * @param {Object} res - Express response object.
   * @param {Array} data - Array of results.
   * @param {Object} pagination - Pagination metadata (e.g., page, limit, total).
   * @param {string} message - Response message.
   * @param {number} [status=200] - HTTP status code.
   */
  const paginatedResponse = (res, data, pagination, message, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
      pagination,
    });
  };
  
  module.exports = { successResponse, errorResponse, paginatedResponse };
  