const fetch = require('node-fetch')

const VaultError = require('../vault-error.js')
const VaultHttpStatusCodes = require('../vault-http-status-codes.json')

const defaultResponseFormatter = res => {
  let Response = {
    headers: {},
    meta: {}
  }

  for (let [field, value] of res.headers.entries()) {
    Response.headers[field] = value
  }

  Response.meta.status = res.status

  if (res.status === 204 || res.status >= 400) {
    Response.meta.statusText = VaultHttpStatusCodes[res.status]
  }

  if (res.status === 204) {
    return Response
  }

  let contentType = res.headers.get('content-type')

  if (!/application\/json/.test(contentType)) {
    return Response
  }

  return res.json().then(({ data, errors, ...meta }) => {
    Response.meta = Object.assign({}, meta, Response.meta)

    if (res.status >= 500) {
      throw new VaultError(errors, Response.meta, Response.headers)
    }

    Response.data = data
    Response.errors = errors

    return Response
  })
}

/**
 * Performs HTTP Request
 * @param {Object} requestOptions
 * @returns {Promise} ({data,headers}) on success
 * @throws {VaultError} on failure
 */
const request = requestOptions => {
  let {
    method,
    url,
    headers,
    body,
    retries,
    timeout,
    responseFormatter
  } = requestOptions

  // https://fetch.spec.whatwg.org/#methods
  method = method.toUpperCase()

  let options = {
    method,
    headers,
    body,
    timeout
  }

  if (typeof responseFormatter !== 'function') {
    responseFormatter = defaultResponseFormatter
  }

  return fetch(url, options)
    .then(responseFormatter)
    .catch(error => {
      if (error instanceof VaultError) {
        throw error
      }

      throw new VaultError(error.message)
    })
}

module.exports = request
