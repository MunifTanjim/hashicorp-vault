const monkeyPatch = (paramsSpecs = {}, params) => {
  // MonkeyPatch #1: KV mount directory
  if (
    Object.keys(paramsSpecs).includes('kvDir') &&
    typeof params.kvDir === 'undefined'
  ) {
    let [kvDir, path] = params.path.split(/\/(.+)/)
    params.kvDir = kvDir
    params.path = path
  }

  return params
}

module.exports = monkeyPatch
