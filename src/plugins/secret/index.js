const endpointMethod = require('../../endpoint/method.js')

const ROUTES = require('../../routes/secret.json')

class SecretPlugin {
  constructor(apiClient) {
    this.core = apiClient
  }

  inject() {
    this.core.secret = {}

    Object.entries(ROUTES).forEach(([scopeName, scopeObj]) => {
      this.core.secret[scopeName] = {}

      if (scopeName === 'kv') {
        Object.entries(scopeObj).forEach(([versionName, apis]) => {
          this.core.secret[scopeName][versionName] = {}
          Object.entries(apis).forEach(([apiName, apiOptions]) => {
            let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

            this.core.secret[scopeName][versionName][
              apiName
            ] = endpointMethod.bind(
              null,
              this.core,
              { method, url, ...rest },
              paramsSpecs
            )
          })
        })
      } else {
        Object.entries(scopeObj).forEach(([apiName, apiOptions]) => {
          let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

          this.core.auth[scopeName][apiName] = endpointMethod.bind(
            null,
            this.core,
            { method, url, ...rest },
            paramsSpecs
          )
        })
      }
    })
  }
}
module.exports = SecretPlugin
