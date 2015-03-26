# azk-parser

- `azk-parser` can read a json an generate an `Azkfile.js`
- `azk-parser` can parse an `Azkfile.js` and generate a json

#### TODO:

```js
var Promise = require('bluebird');
var fs = require('fs');
var AzkParser = require('azk-parser');
var azkParser = new AzkParser();

// promisify fs
Promise.promisifyAll(fs);

// parse json object and generate an Azkfile.js content
fs.readFileAsync('./content.json').then(JSON.parse).then(function(json_data) {
  var azkfile_content = azkParser.generateAzkfile(json_data);
  console.log(azkfile_content);
})
.catch(SyntaxError, function(e) {
  console.error('invalid json in file');
})
.catch(function(e){
  console.error('unable to read file')
});

// validate an `Azkfile.js`
fs.readFileAsync('./Azkfile.js').then(function(azkfile_content) {
  console.log(azkParser.validateAzkFile(azkfile_content));
})
.catch...

// // --- on future ---
// parse an `Azkfile.js`:
// - recast parse + print
// - esprima parse + escodegen generate
// - acorn parse + esotope generate
// - acorn parse + escodegen generate
fs.readFileAsync('./Azkfile.js').then(function(azkfile_content) {
  var json_data = azkParser.parseAzkfileToJSON('Azkfile.js');
  console.log(json_data);
})
.catch...
```

#### before start

```
$ npm install
```

#### test + lint (no watch)

```
$ gulp
```

#### test + lint + watch

```
$ gulp test
```

#### test + watch (no-lint)

```
$ gulp test-no-lint
```

#### publish a patch to npm

```
$ npm run-script patch
```
