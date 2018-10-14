let {
  VAULT_ADDR,
  VAULT_TOKEN,
  VAULT_CLIENT_TIMEOUT,
  VAULT_MAX_RETRIES,
  VAULT_NAMESPACE
} = process.env

const version = require('../package.json').version

let parsedTimeout = parseInt(VAULT_CLIENT_TIMEOUT, 10)
let parsedRetries = parseInt(VAULT_MAX_RETRIES, 10)

const defaultClientConfig = {
  address: VAULT_ADDR || 'http://127.0.0.1:8200',
  namespace: VAULT_NAMESPACE,
  routePrefix: '/v1',
  token: VAULT_TOKEN,
  headers: {
    'user-agent': `NodeHashicorpVault/${version}`,
    'content-type': 'application/json; charset=utf-8'
  },
  options: {
    retries: Number.isNaN(parsedRetries) ? 2 : parsedRetries,
    timeout: Number.isNaN(parsedTimeout) ? 60000 : parsedTimeout
  }
}

module.exports = defaultClientConfig
