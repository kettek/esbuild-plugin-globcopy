# esbuild-plugin-globcopy
An esbuild plugin that adds support for copying files from a source directory to a destination directory using [glob](https://en.wikipedia.org/wiki/Glob_(programming)).

Its primary use case is to copy files from a static directory to a distribution directory on build.

## Installation

```bash
npm i -D esbuild-plugin-globcopy
```

## Usage
As with the current esbuild plugin API, this plugin requires a custom build script for usage.

```js
import esbuild from 'esbuild'
import globcopy from 'esbuild-plugin-globcopy'

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  outdir: 'dist',
  // ...
  plugins: [
    // ...
    globCopy({
      // srcdir: 'static',
      // targets: ['**.png'],
    })
  ]
})
```

## Options
When calling the module, you can pass in an object that contains various options.

### srcdir
This input directory to copy files from. Defaults to `./`.

### targets
Targets can be an array of strings or a single string that provides glob pattern(s).

### outdir
The output directory to copy files to. Defaults to esbuild's `outdir` if unspecified.