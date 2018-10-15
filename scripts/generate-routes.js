const {
  join: joinPath,
  parse: parsePath,
  relative: relativePath,
  resolve: resolvePath
} = require('path')
const { writeFile } = require('fs-extra')
const camelCase = require('lodash/camelCase')
const defaultsDeep = require('lodash/defaultsDeep')
const set = require('lodash/set')
const recursiveReadDir = require('recursive-readdir')

const deepClean = require('clean-deep')
const deepSort = require('deep-sort-object')

const ENDPOINTS_DIR = resolvePath('endpoints')
const ROUTES_DIR = resolvePath('src/routes')

const processParameters = parameters =>
  parameters.reduce((params, { description, name, required, ...param }) => {
    if (required) {
      param.required = true
    }

    if (param.type === 'object' && param.properties) {
      Object.keys(param.properties).forEach(key => {
        delete param.properties[key].description
      })
    }

    params[name] = param

    return params
  }, {})

const processSecretDatabases = routes => {
  let secretDatabases = ['mysql']

  let keysToDeleteFromRoot = new Set()

  secretDatabases.forEach(database => {
    Object.keys(routes.secret.databases[database]).forEach(apiName => {
      if (routes.secret.databases[apiName]) {
        keysToDeleteFromRoot.add(apiName)

        routes.secret.databases[database][apiName] = defaultsDeep(
          {},
          routes.secret.databases[apiName],
          routes.secret.databases[database][apiName]
        )

        if (routes.secret.databases[database][apiName].paramsToDelete) {
          routes.secret.databases[database][apiName].paramsToDelete.forEach(
            key => delete routes.secret.databases[database][apiName].params[key]
          )

          delete routes.secret.databases[database][apiName].paramsToDelete
        }
      }
    })
  })

  Array.from(keysToDeleteFromRoot).forEach(
    key => delete routes.secret.databases[key]
  )
}

const generateRoutes = async () => {
  let routes = {}

  let endpointFiles = await recursiveReadDir(ENDPOINTS_DIR)

  endpointFiles
    .map(file => {
      let { dir: absDir, name: routeName } = parsePath(file)

      return {
        absDir,
        routeName,
        routeDef: require(file)
      }
    })
    .map(
      ({ absDir, routeName, routeDef: { parameters = [], ...routeDef } }) => {
        delete routeDef.summary

        let name = camelCase(routeName)
        let scope = relativePath(ENDPOINTS_DIR, absDir).replace(/\//g, '.')

        return {
          route: {
            ...routeDef,
            params: processParameters(parameters)
          },
          name,
          scope
        }
      }
    )
    .forEach(routeObj => {
      set(routes, `${routeObj.scope}.${routeObj.name}`, routeObj.route)
    })

  processSecretDatabases(routes)

  Object.entries(routes).forEach(([namespace, routes]) => {
    writeFile(
      joinPath(ROUTES_DIR, `${namespace}.json`),
      JSON.stringify(deepSort(deepClean(routes)), null, 2)
    )
  })
}

generateRoutes()
