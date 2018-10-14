/**
 * Adds Namespace / Token to Request header
 * @param {Object} apiClient - Vault API Client
 * @param {Object} options
 */
const beforeRequestHelper = (apiClient, options) => {
  if (apiClient.namespace) {
    options.headers['X-Vault-Namespace'] = apiClient.namespace
  }

  if (apiClient.token) {
    options.headers['X-Vault-Token'] = apiClient.token
  }
}

module.exports = beforeRequestHelper
