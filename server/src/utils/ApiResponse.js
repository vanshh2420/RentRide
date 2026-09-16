/**
 * Standardized API Success Response Envelope
 */
export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response payload
   * @param {string} message - Response message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
