const HTTPError = require('../request/http-error.js')

const validate = (paramsSpecs = {}, params) => {
  Object.entries(paramsSpecs).forEach(([paramName, spec]) => {
    let param = params[paramName]

    let expectedType = spec.type

    let valueIsPresent = typeof param !== 'undefined'

    if (!spec.required && !valueIsPresent) {
      return
    }

    if (spec.required && !valueIsPresent) {
      throw new HTTPError(`Parameter required: '${paramName}'`, 4002)
    }

    if (expectedType === 'integer') {
      let unparsedParam = param
      param = parseInt(param, 10)
      if (Number.isNaN(param)) {
        throw new HTTPError(
          `Invalid Type of Parameter '${paramName}': ${JSON.stringify(
            unparsedParam
          )}, Expected Type: ${expectedType}`,
          4002
        )
      }
    }

    if (expectedType === 'boolean') {
      let valueIsBoolean =
        typeof param === 'string'
          ? ['false', 'true'].includes(param)
          : typeof param === 'boolean'
      if (!valueIsBoolean) {
        throw new HTTPError(
          `Invalid Type of Parameter '${paramName}': ${JSON.stringify(
            param
          )}, Expected Type: ${expectedType}`,
          4002
        )
      }
    }

    if (expectedType === 'array') {
      if (Array.isArray(param)) {
        let expectedItemType = spec.items.type

        if (
          expectedItemType === 'integer' &&
          param.some(item => Number.isNaN(parseInt(item, 10)))
        ) {
          throw new HTTPError(
            `Invalid Type of '${paramName}' items, Expected Type: ${expectedItemType}`,
            4002
          )
        }
      } else {
        throw new HTTPError(
          `Invalid Type of Parameter '${paramName}': ${JSON.stringify(
            param
          )}, Expected Type: ${expectedType}`,
          4002
        )
      }
    }
  })

  return params
}

module.exports = validate
