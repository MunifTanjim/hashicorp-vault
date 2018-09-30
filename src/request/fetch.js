const fetch = require('node-fetch')

const HTTPError = require('./http-error.js')

const getData = response => {
  let contentType = response.headers.get('content-type')

  if (/application\/json/.test(contentType)) {
    return response.json()
  }
}

/**
 * Performs HTTP Request
 * @param {Object} requestOptions
 * @returns {Promise} ({data,headers}) on success
 * @throws {HTTPError} on failure
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

  let responseHeaders = {}

  return fetch(url, options)
    .then(response => {
      for (let [field, value] of response.headers.entries()) {
        responseHeaders[field] = value
      }

      if ([204, 205].includes(response.status)) {
        return
      }

      if (response.status >= 400 || [304].includes(response.status)) {
        return getData(response).then(error => {
          throw new HTTPError(error, response.status, responseHeaders)
        })
      }

      return getData(response)
    })
    .then(data => ({
      data,
      headers: responseHeaders
    }))
    .catch(error => {
      if (error instanceof HTTPError) {
        throw error
      }
      throw new HTTPError(error.message, 500, responseHeaders)
    })
}

module.exports = request
