const beforeRequest = require('./before-request.js')

class HelpersPlugin {
  constructor(apiClient) {
    this.core = apiClient
  }

  inject() {
    /**
     * Saves the Client Token retrieved via Vault authentication backends
     * @param {Object} clientToken - Vault Client Token
     */
    this.core.setToken = clientToken => {
      this.core.token = clientToken
    }

    this.core.setNamespace = namespace => {
      this.core.namespace = namespace
    }

    this.core.hook.before('request', beforeRequest.bind(null, this.core))
  }
}

module.exports = HelpersPlugin
