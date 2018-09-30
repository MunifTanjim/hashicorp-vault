const Hook = require('before-after-hook')

const { version } = require('../package.json')

const deepmerge = require('./utils/deepmerge.js')
const request = require('./request/index.js')

const Plugins = [
  require('./plugins/auth/index.js'),
  require('./plugins/secret/index.js'),
  require('./plugins/sys/index.js')
]

const CLIENT_DEFAULTS = {
  baseUrl: `http://localhost:8200/v1`,
  headers: {
    'user-agent': `NodeHashicorpVault/${version}`
  },
  options: {
    timeout: 0
  }
}

class Vault {
  constructor(options = {}) {
    this.options = deepmerge(CLIENT_DEFAULTS, options)

    this.hook = new Hook()

    this.token = null

    this.request = this.request.bind(this)

    Plugins.forEach(Plugin => this.addPlugin(Plugin))
  }

  addPlugin(Plugin) {
    new Plugin(this).inject()
  }

  request(options = {}) {
    // merge clientOptions with requestOptions
    return this.hook('request', deepmerge(this.options, options), request)
  }
}

module.exports = Vault
