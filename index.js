var ls = require('livescript')
var path = require('path')

var createLivescriptPreprocessor = function (args, config, logger, helper) {
  config = config || {}

  var log = logger.create('preprocessor.livescript')
  var defaultOptions = {
    bare: true,
    header: false
  }
  var options = helper.merge(defaultOptions, args.options || {}, config.options || {})

  var transformPath = args.transformPath || config.transformPath || function (filepath) {
      return filepath.replace(/\.ls$/, '.js')
    }

  return function (content, file, done) {
    var result = null
    var map
    var datauri

    log.debug('Processing "%s".', file.originalPath)
    file.path = transformPath(file.originalPath)

    // Clone the options because livescript.compile mutates them
    var opts = helper._.clone(options)

    try {
      result = ls.compile(content, opts)
    } catch (e) {
      log.error('%s\n  at %s:%d', e.message, file.originalPath, e.location.first_line)
      return done(e, null)
    }

    if (result.v3SourceMap) {
      map = JSON.parse(result.v3SourceMap)
      map.sources[0] = path.basename(file.originalPath)
      map.sourcesContent = [content]
      map.file = path.basename(file.path)
      file.sourceMap = map
      datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(map)).toString('base64')
      done(null, result.js + '\n//@ sourceMappingURL=' + datauri + '\n')
    } else {
      done(null, result.js || result)
    }
  }
}

createLivescriptPreprocessor.$inject = ['args', 'config.livescriptPreprocessor', 'logger', 'helper']

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:livescript': ['factory', createLivescriptPreprocessor]
}
