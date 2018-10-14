const authEndpointMethodsInjector = (core, endpointMethod, routes) => {
  core.auth = {}

  Object.entries(routes).forEach(([scopeName, scopeObj]) => {
    core.auth[scopeName] = {}

    Object.entries(scopeObj).forEach(([apiName, apiOptions]) => {
      let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

      core.auth[scopeName][apiName] = endpointMethod.bind(
        null,
        core,
        { method, url, ...rest },
        paramsSpecs
      )
    })
  })
}

module.exports = authEndpointMethodsInjector
