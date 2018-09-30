const endpointMethod = require('../../endpoint/method.js')

const ROUTES = require('../../routes/sys.json')

class SysPlugin {
  constructor(apiClient) {
    this.core = apiClient
  }

  inject() {
    this.core.sys = {}

    Object.entries(ROUTES).forEach(([apiName, apiOptions]) => {
      let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

      this.core.sys[apiName] = endpointMethod.bind(
        null,
        this.core,
        { method, url, ...rest },
        paramsSpecs
      )
    })
  }
}
module.exports = SysPlugin
