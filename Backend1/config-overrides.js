const path = require('path')

function resolveTS(relativePath) {
  return path.resolve(__dirname, relativePath) + '.tsx'
}

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config
}
