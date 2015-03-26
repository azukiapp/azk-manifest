#!/usr/bin/env node

/*
  azk-parser bin
 */

var AzkParser = require('../lib/src/parser');
var azkParser = new AzkParser();

// https://www.npmjs.com/package/nopt
var nopt     = require('nopt');

var knownOpts  =  {
                    'input' : String,
                    'help'   : Boolean,
                    'verbose'   : Boolean,
                  };

var shortHands =  {
                    'n' : ['--input'],
                    '?' : ['--help'],
                    'h' : ['--help'],
                    'v' : ['--verbose'],
                  };

             // everything is optional.
             // knownOpts and shorthands default to {}
             // arg list defaults to process.argv
             // slice defaults to 2
var parsed_nopt = nopt(knownOpts, shortHands, process.argv, 2);

if (parsed_nopt.help || parsed_nopt.argv.original.length === 0) {
  var usage_message = ['',
    ' Usage:',
    '',
    '   $ azk-parser [options]',
    '',
    ' Options:',
    '',
    '   --input,    -i   input file',
    '   --verbose,  -v   show more info on output',
    '   --help, -h, -?   show this help message',
    '',
    ' Examples: (all lines below will return 5)',
    '',
    '   $ azk-parser -i json_file.json',
    ''].join('\n');
  console.log(usage_message);
  return;
}

var result;
var is_verbose = parsed_nopt.verbose || false;

// verbose
var util = require('util');
var inspect = function (data) {
  console.log('   ' + util.inspect(data, { showHidden:false, colors:true }));
};

is_verbose && console.log('\n parsed_nopt nopt args:');
is_verbose && inspect(parsed_nopt);

result = azkParser.parse(parsed_nopt.input);

is_verbose && console.log('\n parsed_nopt.input:');
is_verbose && inspect(parsed_nopt.input);

is_verbose && console.log('\n azkParser.azk-parserNumber(parsed_nopt.input) -->');
console.log(result);
