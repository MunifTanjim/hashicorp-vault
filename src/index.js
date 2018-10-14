const Hook = require('before-after-hook')

const defaultClientConfig = require('./config.js')

const deepmerge = require('./utils/deepmerge.js')
const request = require('./request/index.js')

const Plugins = [
  require('./plugins/endpoint-methods/index.js'),
  require('./plugins/helpers/index.js')
]

class Vault {
  constructor(clientConfig = {}) {
    let {
      address,
      namespace,
      routePrefix,
      token,
      headers,
      options
    } = deepmerge(defaultClientConfig, clientConfig)

    this.config = {
      baseUrl: `${address.replace(/\/+$/, '')}${routePrefix}`,
      headers,
      options
    }

    this.namespace = namespace
    this.token = token

    this.hook = new Hook()

    this.request = this.request.bind(this)

    Plugins.forEach(Plugin => this.addPlugin(Plugin))
  }

  addPlugin(Plugin) {
    new Plugin(this).inject()
  }

  request(options = {}) {
    // create hook: request
    // merge clientConfig with requestOptions
    return this.hook('request', deepmerge(this.config, options), request)
  }
}

module.exports = Vault
