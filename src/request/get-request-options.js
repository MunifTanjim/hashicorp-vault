const urlTemplate = require('url-template')

const extractUrlVariableNames = require('../utils/extract-url-variable-names.js')

/**
 * Returns Request Options for HTTP client
 * @param {Object} endpointOptions - Endpoint Options
 * @returns {Object} Request Options for HTTP client
 */
const getRequestOptions = (endpointOptions = {}) => {
  let {
    baseUrl,
    body,
    headers,
    method,
    url,
    options: otherOptions,
    ...params
  } = endpointOptions

  // replace :var with {+var} to make it RFC 6570 compatible
  url = url.replace(/:([a-z]\w+)/g, '{+$1}')

  let urlVariableNames = extractUrlVariableNames(url)

  url = urlTemplate.parse(url).expand(params || {})

  if (!/^http/.test(url)) {
    url = `${baseUrl}${url}`
  }

  let remainingParams = Object.keys(params)
    .filter(name => !urlVariableNames.includes(name))
    .reduce(
      (remainingParams, paramName) =>
        Object.assign(remainingParams, { [paramName]: params[paramName] }),
      {}
    )

  if (!['get', 'head'].includes(method)) {
    if (Object.keys(remainingParams).length) {
      body = JSON.stringify(
        remainingParams._data ? remainingParams._data : remainingParams
      )
    }
  }

  return {
    ...otherOptions,
    method,
    url,
    headers,
    body
  }
}

module.exports = getRequestOptions
