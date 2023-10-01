// Crawls the specified Gaia CSV dir and indexes its files.

// note on cache:
// * cache needs to indicate the start position of the first column (it's
//   usually quite far down).
// * cache needs to indicate the start of each line for each gaia csv file,
//   maybe each column as well, try and see.
// * have a caches stored per G, and caches stored per distance from center.
//
// Minimum requirements are offset and length of each line.
// We can then query a CSV with:
// fs.fstatSync(fd, ...
// fs.readSync(fd, buffer, offset, length, position ...

import fs from 'fs';
import process from 'process';
import * as console from 'console';
import { readZippedFileSync } from './readZippedFile';
import { Simulate } from 'react-dom/test-utils';
import load = Simulate.load;
import { bufferToLineStrings } from "./bufferToLineStrings";

const cliOptions = Bun.argv[2];
let options: any;

function usage() {
  console.error('Example:\nnpm run index-csv-dir \'' + JSON.stringify({
    gaiaDir: '/path/to/csv/files',
  }) + '\'');
}

(function checkArgs() {
  try {
    options = JSON.parse(cliOptions);
    if (!fs.statSync(options.gaiaDir).isDirectory()) {
      throw 'Gaia path should be a directory.';
    }
  }
  catch (error: any) {
    console.error('This command requires certain JSON options.');
    usage();
    console.error('Technical details:', error.toString());
    process.exit(1);
  }
}());

const { gaiaDir } = options;

let skipped = 0;
let processed = 0;
let currentFile = '';

function indexLine(line: number[]) {
  //
}

const fileList = fs.readdirSync(gaiaDir);
for (let i = 0, len = fileList.length; i < len; i++) {
  currentFile = fileList[i];
  const fileName = gaiaDir + '/' + currentFile;
  const stat = fs.statSync(fileName);
  if (stat.isDirectory()) {
    console.log('Skipping', fileName, '- target is a directory.');
    skipped++;
    continue;
  }

  console.log('Processing', fileName);

  let buffer: Buffer;
  const extPart = fileName.slice(-4);
  const start = Date.now();
  if (extPart === '.csv') {
    buffer = fs.readFileSync(fileName);
    bufferToLineStrings(buffer, indexLine);
  }
  else if (extPart === 'v.gz') {
    buffer = readZippedFileSync(fileName);
    bufferToLineStrings(buffer, indexLine);
  }
  else {
    console.log('Skipping', fileName, '- extension not recognized.');
    continue;
  }

  const loadedAfter = Date.now() - start;
  console.log(' * Process time:', loadedAfter);
}

await Bun.write(Bun.stdout, '\n');
console.log(
  skipped, `file${skipped !== 1 ? 's' : ''} skipped,`,
  processed, `file${processed !== 1 ? 's' : ''} processed.`,
);
