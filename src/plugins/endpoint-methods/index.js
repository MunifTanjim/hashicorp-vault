const endpointMethod = require('../../endpoint/method.js')

const injectors = {
  auth: require('./injectors/auth.js'),
  secret: require('./injectors/secret.js'),
  sys: require('./injectors/sys.js')
}

const routes = {
  auth: require('../../routes/auth.json'),
  secret: require('../../routes/secret.json'),
  sys: require('../../routes/sys.json')
}

class EndpointMethodsPlugin {
  constructor(apiClient) {
    this.core = apiClient
  }

  inject() {
    Object.entries(injectors).forEach(([name, injector]) => {
      injector(this.core, endpointMethod, routes[name])
    })
  }
}

module.exports = EndpointMethodsPlugin
