const beforeRequest = require('./before-request.js')

const endpointMethod = require('../../endpoint/method.js')

const ROUTES = require('../../routes/auth.json')

class AuthPlugin {
  constructor(apiClient) {
    this.core = apiClient
  }

  inject() {
    this.core.auth = {}

    Object.entries(ROUTES).forEach(([scopeName, scopeObj]) => {
      this.core.auth[scopeName] = {}

      Object.entries(scopeObj).forEach(([apiName, apiOptions]) => {
        let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

        this.core.auth[scopeName][apiName] = endpointMethod.bind(
          null,
          this.core,
          { method, url, ...rest },
          paramsSpecs
        )
      })
    })

    /**
     * Saves the Client Token retrieved via Vault authentication backends
     * @param {Object} clientToken - Vault Client Token
     */
    this.core.authenticate = clientToken => {
      this.core.token = clientToken
    }

    this.core.hook.before('request', beforeRequest.bind(null, this.core))
  }
}

module.exports = AuthPlugin
