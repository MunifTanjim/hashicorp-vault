const HTTP_STATUS_CODES = {
  200: `Success with data`,
  204: `Success, no data returned.`,
  400: `Invalid request, missing or invalid data.`,
  403: `Forbidden, your authentication details are either incorrect, you don't have access to this feature, or - if CORS is enabled - you made a cross-origin request from an origin that is not allowed to make such requests.`,
  404: `Invalid path. This can both mean that the path truly doesn't exist or that you don't have permission to view a specific path. We use 404 in some cases to avoid state leakage.`,
  429: `Default return code for health status of standby nodes. This will likely change in the future.`,
  473: `Default return code for health status of performance standby nodes.`,
  500: `Internal server error. An internal error has occurred, try again later. If the error persists, report a bug.`,
  502: `A request to Vault required Vault making a request to a third party; the third party responded with an error of some kind.`,
  503: `Vault is down for maintenance or is currently sealed. Try again later.`
}

class HTTPError extends Error {
  constructor(error, status, headers) {
    super(error.errors || error)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.error = error.errors || error
    this.status = status
    this.statusText = HTTP_STATUS_CODES[status]
    this.headers = headers
  }
}

module.exports = HTTPError
