const VaultError = require('../vault-error.js')

const validate = (paramsSpecs = {}, params) => {
  Object.entries(paramsSpecs).forEach(([paramName, spec]) => {
    let param = params[paramName]

    let expectedType = spec.type

    let valueIsPresent = typeof param !== 'undefined'

    if (!spec.required && !valueIsPresent) {
      return
    }

    if (spec.required && !valueIsPresent) {
      throw new VaultError(`Parameter required: '${paramName}'`, {
        status: 400
      })
    }

    if (expectedType === 'integer') {
      let unparsedParam = param
      param = parseInt(param, 10)
      if (Number.isNaN(param)) {
        throw new VaultError(
          `Invalid Type for Parameter '${paramName}': ${JSON.stringify(
            unparsedParam
          )}, Expected Type: ${expectedType}`,
          { status: 400 }
        )
      }
    }

    if (expectedType === 'boolean') {
      let valueIsBoolean = typeof param === 'boolean'

      if (!valueIsBoolean) {
        throw new VaultError(
          `Invalid Type for Parameter '${paramName}': ${JSON.stringify(
            param
          )}, Expected Type: ${expectedType}`,
          { status: 400 }
        )
      }
    }

    if (expectedType === 'array') {
      if (!Array.isArray(param)) {
        throw new VaultError(
          `Invalid Type of Parameter '${paramName}': ${JSON.stringify(
            param
          )}, Expected Type: ${expectedType}`,
          { status: 400 }
        )
      }

      let expectedItemType = spec.items.type

      if (expectedItemType === 'integer') {
        param = param.map(item => parseInt(item, 10))

        if (param.some(item => Number.isNaN(item))) {
          throw new VaultError(
            `Invalid Type for '${paramName}' items, Expected Type: ${expectedItemType}`,
            { status: 400 }
          )
        }
      }

      if (
        expectedItemType === 'string' &&
        param.some(item => typeof item !== 'string')
      ) {
        throw new VaultError(
          `Invalid Type for '${paramName}' items, Expected Type: ${expectedItemType}`,
          { status: 400 }
        )
      }
    }
  })

  return params
}

module.exports = validate
