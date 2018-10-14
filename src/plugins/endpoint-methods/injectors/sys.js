const sysEndpointMethodsInjector = (core, endpointMethod, routes) => {
  core.sys = {}

  Object.entries(routes).forEach(([apiName, apiOptions]) => {
    let { method, params: paramsSpecs, path: url, ...rest } = apiOptions

    core.sys[apiName] = endpointMethod.bind(
      null,
      core,
      { method, url, ...rest },
      paramsSpecs
    )
  })
}

module.exports = sysEndpointMethodsInjector
