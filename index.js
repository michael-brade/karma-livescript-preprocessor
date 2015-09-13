var ls = require('livescript')
var path = require('path')

var createLivescriptPreprocessor = function (args, config, logger, helper) {
  config = config || {}

  var log = logger.create('preprocessor.livescript')
  var defaultOptions = {
    bare: true,
	map: "embedded",
    header: false
  }
  var options = helper.merge(defaultOptions, args.options || {}, config.options || {})

  var transformPath = args.transformPath || config.transformPath || function (filepath) {
      return filepath.replace(/\.ls$/, '.js')
    }

  return function (content, file, done) {
    var result = null

    log.debug('Processing "%s".', file.originalPath)
    file.path = transformPath(file.originalPath)

	options.filename = path.basename(file.originalPath)

    try {
      result = ls.compile(content, options)
    } catch (e) {
	  console.log("ls compile ERROR:", e, arguments)
      log.error('%s\n  at %s:%d', e, file.originalPath)
      return done(e, null)
    }

    if (result.code) {
      done(null, result.code)
    } else {
      done(null, result)
    }
  }
}

createLivescriptPreprocessor.$inject = ['args', 'config.livescriptPreprocessor', 'logger', 'helper']

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:livescript': ['factory', createLivescriptPreprocessor]
}
