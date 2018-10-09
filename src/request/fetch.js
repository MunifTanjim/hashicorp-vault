const fetch = require('node-fetch')

const { VaultError, HTTP_STATUS_CODES } = require('./vault-error.js')

const getFormattedResponse = response => {
  let contentType = response.headers.get('content-type')

  if (!/application\/json/.test(contentType)) {
    return
  }

  let headers = {}

  for (let [field, value] of response.headers.entries()) {
    headers[field] = value
  }

  let statusInfo = {
    status: response.status
  }

  if (response.status >= 400) {
    statusInfo.statusText = HTTP_STATUS_CODES[response.status]
  }

  if ([204, 205].includes(response.status)) {
    return {
      meta: statusInfo,
      headers
    }
  }

  return response.json().then(({ data, errors, ...metaInfo }) => {
    return {
      data,
      errors,
      headers,
      meta: Object.assign({}, metaInfo, statusInfo)
    }
  })
}

/**
 * Performs HTTP Request
 * @param {Object} requestOptions
 * @returns {Promise} ({data,headers}) on success
 * @throws {VaultError} on failure
 */
const request = requestOptions => {
  let { method, url, headers, body, timeout } = requestOptions

  // https://fetch.spec.whatwg.org/#methods
  method = method.toUpperCase()

  let options = {
    method,
    headers,
    body,
    timeout
  }

  return fetch(url, options)
    .then(response => {
      if (response.status >= 500) {
        return getFormattedResponse(response).then(
          ({ errors, meta, headers }) => {
            throw new VaultError(errors, meta, headers)
          }
        )
      }

      return getFormattedResponse(response)
    })
    .catch(error => {
      if (error instanceof VaultError) {
        throw error
      }
      throw new VaultError(error.message)
    })
}

module.exports = request
