# karma-livescript-preprocessor

> Preprocessor to compile LiveScript on the fly.

## Installation

Because the current karma-livescript-preprocessor npm package seems to be dead, you have to install
this package by running:

```bash
npm install github:michael-brade/karma-livescript-preprocessor --save-dev
```

## Configuration

Following code shows the default configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.ls': ['livescript']
    },

    livescriptPreprocessor: {
      // options passed to the livescript compiler - those are the defaults
      options: {
        bare: true,
        map: "embedded"
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.ls$/, '.js')
      }
    },

    // make sure to include the .ls files, not the compiled .js files
    files: [
      '**/*.ls'
    ]
  })
}
```


----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
