// lib/model/response.js

/**
 * Generic repository/service response structure
 * @template T
 */
export class GeneralResponse {
  /**
   * @param {boolean} success
   * @param {string} message
   * @param {T|null} [data]
   */
  constructor(success, message, data = null) {
    this.success = success;
    this.message = message;
    this.data = data ?? null;
  }
}
