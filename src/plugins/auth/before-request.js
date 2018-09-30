/**
 * Adds X-Vault-Token to Request header
 * @param {Object} apiClient - Vault API Client
 * @param {Object} options
 */
const authenticationBeforeRequest = (apiClient, options) => {
  if (!apiClient.token) {
    return
  }

  options.headers['X-Vault-Token'] = apiClient.token
}

module.exports = authenticationBeforeRequest
