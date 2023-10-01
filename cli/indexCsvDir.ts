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
import { readZippedFileSync } from './readZippedFile';
import { bufferToLineStrings } from './bufferToLineStrings';
import * as console from 'console';

if (!fs.existsSync('./cache/bsc5p_names_min.json')) {
  console.error(
    'bsc5p_names_min.json not found in the cache dir; please download it ' +
    'from the link below and place it in the cache dir.',
    '\nhttps://github.com/frostoven/BSC5P-JSON-XYZ/tree/primary/catalogs'
  );
  process.exit(1);
}

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

// Prepare BSC names for easy lookup.
const starNames = {
  // Example structure:
  // "Gaia DR3 4701860922688030720": {
  //   bscIndex: 9108,
  //   names: [ "HIP 377", "Gaia DR3 4701860922688030720", "HD 225253" ]
  // }
  // Note that not all BSC names have GAIA DR3 designations. At the time of
  // writing, 8347 of 9110 objects (91.6%) have names, which is pretty good
  // considering some of the 'missing' objects are galaxies and supernovae.
};
// @ts-ignore.
const bscNameEntries = JSON.parse(fs.readFileSync('./cache/bsc5p_names_min.json'));
for (let i = 0, len = bscNameEntries.length; i < len; i++) {
  const { i: index, n: names } = bscNameEntries[i];
  for (let j = 0, len = names.length; j < len; j++) {
    const name = names[j];
    if (name.substring(0, 8) === 'Gaia DR3') {
      starNames[name] = {
        bscIndex: index, names,
      };
    }
  }
}

const { gaiaDir } = options;

// The star name column (e.g. "Gaia DR3 5930906457715278208") always starts at
// the same place no matter what thanks to the fact that the column before it
// always has the same length. These two offsets exclude the quotes that
// contain the name.
const nameOffsetStart = 21;
const nameOffsetEnd = 49;

// The columns we want the script to seek out and index.
const columnsToIndex = [ 'designation', 'ra', 'dec', 'parallax', 'grvs_mag' ];
// The positions of column keys in columnKeys below.
const columnsToIndexPositions: number[] = [ /* Example: 1, 5, 7, 9, 107 */];

// Stats.
let skipped = 0;
let processed = 0;

function stringToArrayBuffer(str) {
  return new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
}

// https://stackoverflow.com/questions/39725716/how-to-convert-javascript-array-to-binary-data-and-back-for-websocket
function arrayBufferToString(ab) {
  return new Uint8Array(ab).reduce((p, c) => p + String.fromCharCode(c), '');
}

// Name of the file currently being processed.
let currentFile = '';
// N-th file being processed, assuming alphabetical order.
let fileNumber = 0;
// Line number of the current file.
let currentLine = -1;
// Header column reference.
let columnKeys: string[] = [];
// The magical thing we're building that lets us query 3TB like it's nothing.
// Written as any because I have no idea to how write this in TS syntax.
let indexTable: any = [
  // Example:
  // [MAGIC, FILE_NUMBER[
  //   PARALLAX_INDEX[FILE_BYTE_POSITION],
  //   RA_INDEX[FILE_BYTE_POSITION],...
  //   BSC_INDEX|-1
  //   ],...
  // ]
  //
  // Actual output:
  // [
  //   [], [
  //     [], [
  //       [ 20, 50 ], [ 89, 106 ], [ 117, 135 ], [ 146, 150 ], [ 785, 789 ], -1
  //     ], [
  //       [ 20, 50 ], [ 88, 106 ], [ 118, 136 ], [ 148, 167 ], [ 917, 921 ], -1
  //     ], ...
  //   ]
  // ]
];
// Indexes the current line. This is the heart of this file.
function onFindLine(line: number[], lineOffset: number, columnOffsets: number[]) {
  // console.log([lineOffset], Buffer.from(line).toString());
  // Create this line's index entry. Note that it's blank for the header; we
  // use that as our magic number.
  indexTable[fileNumber].push([]);

  if (++currentLine === 0) {
    // Example: columnKeys = [ 'solution_id', 'designation', 'source_id',... ];
    columnKeys = Buffer.from(line).toString().split(',');

    // Build a fast lookup table for columnKeys.
    for (let i = 0, len = columnsToIndex.length; i < len; i++) {
      const columnName = columnsToIndex[i];
      const index = columnKeys.indexOf(columnName);
      if (index === -1) {
        console.error(
          `Error: requested column ${columnName} cannot be indexed from ` +
          `${currentFile} because no such column exists.`
        );
        continue;
      }
      columnsToIndexPositions.push(index);
    }
    return;
  }

  // Get this file's index entry.
  const indexEntry = indexTable[fileNumber][currentLine];

  // console.log({columnKeys});
  // console.log({columnsToIndex, columnsToIndexPositions});
  // console.log({columnOffsets});

  // Save the line offset and length.
  indexEntry.push(lineOffset, line.length);

  // Our column offsets, obviously, contain the starting points of our columns.
  // What is important to note here is that is the index of each column offset
  // corresponds to index of each column in columnKeys. This allows is to index
  // names from columnsToIndex without having to do any explicit lookup. I have
  // no faith that this comment makes any sense :'). But, TL;DR, the math
  // implicitly gives us lookup without needing to search for starting points.
  for (let i = 0, len = columnsToIndexPositions.length; i < len; i++) {
    const columnStart = columnOffsets[columnsToIndexPositions[i]];
    const columnEnd = columnOffsets[columnsToIndexPositions[i] + 1] - 1;
    // console.assert('-> indexing', Buffer.from(line.slice(columnStart, columnEnd)).toString());
    indexEntry.push([ columnStart, columnEnd ]);
  }

  // Get this line's DR3 name and associate it with its cultural names.
  // Dev note: always do this last; we specifically define the last item in the
  // array as the reference to alternate names.
  const name = Buffer.from(line.slice(nameOffsetStart, nameOffsetEnd)).toString();
  const alternateNameInfo = bscNameEntries[name];
  if (alternateNameInfo) {
    indexEntry.push(alternateNameInfo.bscIndex);
  }
  else {
    indexEntry.push(-1);
  }

  if (currentLine > 5) {
    // const indexString = JSON.stringify(indexTable);
    // console.log(stringToArrayBuffer(indexString));
    // fs.writeFileSync('index.dat', indexString);
    console.log(indexTable);
    process.exit();
  }
}

const fileList = fs.readdirSync(gaiaDir);
for (let len = fileList.length; fileNumber < len; fileNumber++) {
  // Create an index entry for this file.
  indexTable.push([]);

  currentLine = -1;
  currentFile = fileList[fileNumber];
  const fileName = gaiaDir + '/' + currentFile;
  const stat = fs.statSync(fileName);
  if (stat.isDirectory()) {
    // TODO: make this fatal. Make it clear it's for performance reasons.
    console.log('Skipping', fileName, '- target is a directory.');
    skipped++;
    continue;
  }

  let buffer: Buffer;
  const extPart = fileName.slice(-4);
  const start = Date.now();
  if (extPart === '.csv') {
    buffer = fs.readFileSync(fileName);
    bufferToLineStrings(buffer, onFindLine);
  }
  else if (extPart === 'v.gz') {
    buffer = readZippedFileSync(fileName);
    bufferToLineStrings(buffer, onFindLine);
  }
  else {
    // TODO: make this fatal. Make it clear it's for performance reasons.
    console.log('Skipping', fileName, '- extension not recognized.');
    continue;
  }
  console.log('Processing', fileName);

  const loadedAfter = Date.now() - start;
  console.log(' * Process time:', loadedAfter);
}

await Bun.write(Bun.stdout, '\n');
console.log(
  skipped, `file${skipped !== 1 ? 's' : ''} skipped,`,
  processed, `file${processed !== 1 ? 's' : ''} processed.`,
);
