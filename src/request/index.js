const fetch = require('./fetch.js')
const getRequestOptions = require('./get-request-options.js')

/**
 * Gets the Request Options and Performs Request
 * @param {Object} endpointOptions
 */
const request = endpointOptions => {
  let requestOptions = getRequestOptions(endpointOptions)
  return fetch(requestOptions)
}

module.exports = request
