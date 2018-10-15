const nestedScopes = {
  kv: ['v1', 'v2'],
  databases: ['mysql']
}

const injectEndpointMethodsForScope = (
  scopeName,
  scopeObj,
  injectionPoint,
  endpointMethod,
  core
) => {
  injectionPoint[scopeName] = {}

  Object.entries(scopeObj).forEach(([apiName, apiOptions]) => {
    if (nestedScopes[scopeName] && nestedScopes[scopeName].includes(apiName)) {
      return injectEndpointMethodsForScope(
        apiName,
        apiOptions,
        injectionPoint[scopeName],
        endpointMethod,
        core
      )
    }

    let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

    injectionPoint[scopeName][apiName] = endpointMethod.bind(
      null,
      core,
      { method, url, ...rest },
      paramsSpecs
    )
  })
}

const secretEndpointMethodsInjector = (core, endpointMethod, routes) => {
  core.secret = {}

  Object.entries(routes).forEach(([scopeName, scopeObj]) => {
    injectEndpointMethodsForScope(
      scopeName,
      scopeObj,
      core.secret,
      endpointMethod,
      core
    )
  })
}

module.exports = secretEndpointMethodsInjector
