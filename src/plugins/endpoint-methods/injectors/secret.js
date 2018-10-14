const secretEndpointMethodsInjector = (core, endpointMethod, routes) => {
  core.secret = {}

  Object.entries(routes).forEach(([scopeName, scopeObj]) => {
    core.secret[scopeName] = {}

    if (scopeName === 'kv') {
      Object.entries(scopeObj).forEach(([versionName, apis]) => {
        core.secret[scopeName][versionName] = {}

        Object.entries(apis).forEach(([apiName, apiOptions]) => {
          let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

          core.secret[scopeName][versionName][apiName] = endpointMethod.bind(
            null,
            core,
            { method, url, ...rest },
            paramsSpecs
          )
        })
      })
    } else {
      Object.entries(scopeObj).forEach(([apiName, apiOptions]) => {
        let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

        core.auth[scopeName][apiName] = endpointMethod.bind(
          null,
          core,
          { method, url, ...rest },
          paramsSpecs
        )
      })
    }
  })
}

module.exports = secretEndpointMethodsInjector
