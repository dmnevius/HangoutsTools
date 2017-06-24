/* eslint strict: ["off"] */
/* eslint import/no-extraneous-dependencies: ["off"] */

'use strict';

const fs = require('fs');
const closure = require('google-closure-compiler-js');

fs.writeFileSync('./app/bundle.js', closure.compile({
  compilationLevel: 'ADVANCED',
  warningLevel: 'VERBOSE',
  externs: [
    'vue',
  ],
  jsCode: [{
    src: fs.readFileSync('./app/bundle.js', 'utf-8'),
  }],
}).compiledCode);

console.log('Done');
