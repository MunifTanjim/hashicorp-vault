const {
  join: joinPath,
  parse: parsePath,
  relative: relativePath,
  resolve: resolvePath
} = require('path')
const { writeFile } = require('fs-extra')
const { camelCase, set } = require('lodash')
const recursiveReadDir = require('recursive-readdir')

const deepClean = require('clean-deep')
const deepSort = require('deep-sort-object')

const ENDPOINTS_DIR = resolvePath('endpoints')
const ROUTES_DIR = resolvePath('src/routes')

const generateRoutes = async () => {
  let routes = {}

  let endpointFiles = await recursiveReadDir(ENDPOINTS_DIR)

  endpointFiles
    .map(file => ({ route: require(file), ...parsePath(file) }))
    .map(({ route: { parameters, summary, ...route }, dir, name }) => ({
      route: {
        ...route,
        params: parameters.reduce(
          (params, { description, name, required, ...param }) => {
            if (required) param.required = true
            return Object.assign(params, { [name]: param })
          },
          {}
        )
      },
      name: camelCase(name),
      scope: relativePath(ENDPOINTS_DIR, dir).replace(/\//g, '.')
    }))
    .forEach(routeObj => {
      set(routes, `${routeObj.scope}.${routeObj.name}`, routeObj.route)
    })

  Object.entries(routes).forEach(([namespace, routes]) => {
    writeFile(
      joinPath(ROUTES_DIR, `${namespace}.json`),
      JSON.stringify(deepSort(deepClean(routes)), null, 2)
    )
  })
}

generateRoutes()
