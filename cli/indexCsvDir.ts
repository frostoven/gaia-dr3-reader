// Crawls the specified Gaia CSV dir and indexes its files.

import fs from 'fs';
import fsAwait from 'fs/promises';
import process from 'process';
import { bufferToLineStrings } from './bufferToLineStrings';
import * as console from 'console';
import { AggressiveFilePreload } from './AggressiveFilePreload';
import { calculateAbsoluteMagnitude, calculateLuminosity } from './mathUtils';
import { lumToEffectiveTemperature } from './effectiveTemperature';

const { max, round } = Math;

// -- requirements check----------------------------------------- //

if (fs.existsSync('./cache/manifest.json')) {
  console.log(
    'Manifest exists in the cache directory. Please delete it if you want ' +
    'rerun this script.',
  );
  process.exit(1);
}

function checkCatalog(fileName: string) {
  if (!fs.existsSync(fileName)) {
    console.error(
      fileName + ' not found in the cache dir; please download it ' +
      'from the link below and place it in the cache dir.',
      '\nhttps://github.com/frostoven/BSC5P-JSON-XYZ/tree/primary/catalogs'
    );
    process.exit(1);
  }
}

checkCatalog('./cache/bsc5p_radec_min.json');
checkCatalog('./cache/bsc5p_names_min.json');
checkCatalog('./cache/blackbody.json');

// -- args parsing ---------------------------------------------- //

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

// @ts-ignore
const bscEntries = JSON.parse(fs.readFileSync('./cache/bsc5p_radec_min.json'));
// @ts-ignore
const blackbody = JSON.parse(fs.readFileSync('./cache/blackbody.json'));

// TODO: add indexing type option.
//  * index as number increment: own file, array-based.
//  * index as string map: own file, js object.
//  * index file position only: no own file, iterative only.
//
// // Stars with Gvrs magnitude less than 7 (Earth-visible).
// let gUnder7set: any = [
//   // The first 9110 entries come from the BSC. Everything after tha comes from
//   // the GAIA DR3 dataset.
//   ...bscEntries,
// ];
//
// Stars under 1000 parsecs from Earth (326 LY), visible or not. Note that this
// includes the bright star catalog, even stars that are further than 326
// parsecs away.
let distanceUnder360set: any = [
  // The first 9110 entries come from the BSC. Everything after tha comes from
  // the GAIA DR3 dataset.
  ...bscEntries,
];

const { gaiaDir } = options;

// -- main script section --------------------------------------- //

// The star name column (e.g. "Gaia DR3 5930906457715278208") always starts at
// the same place no matter what thanks to the fact that the column before it
// always has the same length. These two offsets exclude the quotes that
// contain the name.
const nameOffsetStart = 21;
const nameOffsetEnd = 48;

// The columns we want the script to seek out and index.
const columnsToIndex = [ 'designation', 'ra', 'dec', 'parallax', 'grvs_mag' ];
// The positions of column keys in columnKeys below.
const columnsToIndexPositions: number[] = [ /* Example: 1, 5, 7, 9, 107 */];

// Stats.
let skipped = 0;
let processed = 0;

// Name of the file currently being processed.
let currentFile = '';
// N-th file being processed, assuming alphabetical order.
let fileNumber = 0;
// Line number of the current file.
let lineNumber = -1;
// Header column reference.
let columnKeys: string[] = [];
// NOTE: all indexTable and indexEntry instances have been commented out as per
// the info in the README. You may comment them all out to play with the
// original idea.
// The magical thing we're building that lets us query 3TB like it's nothing.
// Written as any because I have no idea to how write this in TS syntax.
// let indexTable: any = [
//   // Example:
//   // [MAGIC, FILE_NUMBER[
//   //   PARALLAX_INDEX[FILE_BYTE_POSITION],
//   //   RA_INDEX[FILE_BYTE_POSITION],...
//   //   BSC_INDEX|-1
//   //   ],...
//   // ]
//   //
//   // Actual output:
//   // [
//   //   [], [
//   //     [], [
//   //       [ 20, 50 ], [ 89, 106 ], [ 117, 135 ], [ 146, 150 ], [ 785, 789 ], -1
//   //     ], [
//   //       [ 20, 50 ], [ 88, 106 ], [ 118, 136 ], [ 148, 167 ], [ 917, 921 ], -1
//   //     ], ...
//   //   ]
//   // ]
// ];
// Indexes the current line. This is the heart of this file.
function onFindLine(line: number[], lineOffset: number, columnOffsets: number[]) {
  // Create this line's index entry. Note that it's blank for the header; we
  // use that as our magic number.
  // indexTable[fileNumber].push([]);

  // console.log([lineOffset], Buffer.from(line).toString());

  if (++lineNumber === 0) {
    // -1 here specifically mean "header line."
    // indexTable[fileNumber][lineNumber] = [ -1 ];
    // Example: columnKeys = [ 'solution_id', 'designation', 'source_id',... ];
    columnKeys = Buffer.from(line).toString().split(',');

    if (columnsToIndexPositions.length) {
      if (columnsToIndexPositions.length !== columnsToIndex.length) {
        console.error('Error: columns are inconsistent between files.');
        process.exit(1);
      }
      return;
    }

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
  // const indexEntry = indexTable[fileNumber][lineNumber];

  // console.log({columnKeys});
  // console.log({columnsToIndex, columnsToIndexPositions});
  // console.log({columnOffsets});

  // Save the line offset and length.
  // indexEntry.push(lineOffset, line.length);

  // // Our column offsets, obviously, contain the starting points of our columns.
  // // What is important to note here is that is the index of each column offset
  // // corresponds to index of each column in columnKeys. This allows is to index
  // // names from columnsToIndex without having to do any explicit lookup. I have
  // // no faith that this comment makes any sense :'). But, TL;DR, the math
  // // implicitly gives us lookup without needing to search for starting points.
  // for (let i = 0, len = columnsToIndexPositions.length; i < len; i++) {
  //   const columnStart = columnOffsets[columnsToIndexPositions[i]];
  //   const columnEnd = columnOffsets[columnsToIndexPositions[i] + 1] - 1;
  //   // console.assert('-> indexing', Buffer.from(line.slice(columnStart, columnEnd)).toString());
  //   indexEntry.push([ columnStart, columnEnd ]);
  // }

  // Get this line's DR3 name and associate it with its cultural names.
  // Dev note: always do this last; we specifically define the last item in the
  // array as the reference to alternate names.
  const name = Buffer.from(line.slice(nameOffsetStart, nameOffsetEnd)).toString();
  const alternateNameInfo = bscNameEntries[name];
  if (alternateNameInfo) {
    // indexEntry.push(alternateNameInfo.bscIndex);
  }
  else {
    // indexEntry.push(-1);

    // Seeing as a pop name does not exist for this star, we can piggyback off
    // that here and check if it belongs to one of our curated datasets.
    // TODO: Make these positions dynamic. We hard-code column positions for
    //  now, but the positions will eventually need to be calculated using
    //  rules above.
    const MAG_POS = columnsToIndexPositions[4];
    let mag: any = Buffer.from(line.slice(columnOffsets[MAG_POS], columnOffsets[MAG_POS + 1] - 1)).toString();

    const PAR_POS = columnsToIndexPositions[3];
    const par = Number(Buffer.from(line.slice(columnOffsets[PAR_POS], columnOffsets[PAR_POS + 1] - 1)).toString()) / 1000;
    const parsecs = 1 / par;
    if (parsecs < 1.3) {
      // There are some values not only "closer" than Proxima Centauri, but
      // even some stars with negative distances. This is a known problem in
      // the Gaia DR3 database.
      return;
    }

    if (mag !== 'null') {
      const NAME_POS = columnsToIndexPositions[0];
      const RA_POS = columnsToIndexPositions[1];
      const DEC_POS = columnsToIndexPositions[2];

      // Note: we offset the name by 10 to cut off the "Gaia DR3 " part to save
      // space. This saves 11MB over 1 million entries.
      const name = Number(Buffer.from(line.slice(columnOffsets[NAME_POS] + 10, columnOffsets[NAME_POS + 1] - 2)).toString());
      if (!name) {
        console.error('Found bad name. Dump:', { name }, line);
        return process.exit(1);
      }
      const ra = Number(Buffer.from(line.slice(columnOffsets[RA_POS], columnOffsets[RA_POS + 1] - 1)).toString());
      const dec = Number(Buffer.from(line.slice(columnOffsets[DEC_POS], columnOffsets[DEC_POS + 1] - 1)).toString());
      mag = Number(mag);

      // if (mag < 7) {
      //   const absMag = calculateAbsoluteMagnitude(mag, parsecs);
      //   const naiveLum = calculateLuminosity(absMag);
      //   const kelvin = round(lumToEffectiveTemperature(naiveLum));
      //   const color = blackbody[max(kelvin <= 100000 ? kelvin : 100000, 50)];
      //   gUnder7set.push({
      //     i: gUnder7set.length,
      //     n: name,
      //     r: ra,
      //     d: dec,
      //     p: parsecs,
      //     N: naiveLum,
      //     K: { r: color.r, g: color.g, b: color.b },
      //     // G: mag,
      //   });
      // }
      if (parsecs < 360) {
        // console.log(`[${name}] parallax: ${par}; 1/parallax = ${parsecs} parsecs.`);
        // console.log(`[${name}] Parsec check: parallax=${par}; parsecs=${parsecs}; ${parsecs} < 1.3? ${parsecs < 1.3020}`);
        // TODO: replace this with the alkalurops lib and test. It came into
        //  existence only after we stopped needing this file.
        const absMag = calculateAbsoluteMagnitude(mag, parsecs);
        const naiveLum = calculateLuminosity(absMag);
        const kelvin = round(lumToEffectiveTemperature(naiveLum));
        const color = blackbody[max(kelvin <= 100000 ? kelvin : 100000, 50)];
        distanceUnder360set.push({
          i: distanceUnder360set.length,
          n: name,
          r: ra,
          d: dec,
          p: parsecs,
          N: naiveLum,
          K: { r: color.r, g: color.g, b: color.b },
          // G: mag,
        });
      }

      // // console.log({ name, ra, dec, par, mag });
      // if (!global.xxx) {
      //   global.xxx = 1;
      // }
      // global.xxx++;
      // if (global.xxx > 15000) {
      //   // console.log('gUnder7set size:', gUnder7set.length);
      //   // console.log('distanceUnder360set size:', distanceUnder360set.length);
      //   process.exit();
      // }
    }
  }
}

// This is used to pre-emptively load the next file into RAM while the current
// file is being processed.
const filesLoaded = {
  current: null,
  next: null,
};

// Get the file list.
const fileList = fs.readdirSync(gaiaDir).sort((a, b) => {
  // Sort the file list alphabetically, assuming no special characters.
  if (a < b) {
    return -1;
  }
  else if (a > b) {
    return 1;
  }
  return 0;
});

// if (fs.existsSync('/tmp/dr3_index.part.dat')) {
//   console.log('-> Found /tmp/dr3_index.part.dat, resuming processing.');
//   const scriptCheckpoint = fs.readFileSync('/tmp/dr3_index.part.dat');
//   // @ts-ignore
//   // indexTable = JSON.parse(scriptCheckpoint);
//   // console.log('Resuming at file number', indexTable.length);
//   // fileNumber = indexTable.length;
//
//   // @ts-ignore
//   gUnder7set = JSON.parse(fs.readFileSync('/tmp/dr3_gUnder7set.part.json'));
//   // @ts-ignore
//   distanceUnder360set = JSON.parse(fs.readFileSync('/tmp/dr3_distanceUnder360set.part.json'));
// }

let startTime = Date.now();
if (fs.existsSync('/tmp/dr3_position.json')) {
  console.log('-> Found /tmp/dr3_position.json, resuming processing.');
  const scriptCheckpoint = fs.readFileSync('/tmp/dr3_position.json');
  // @ts-ignore
  const data = JSON.parse(scriptCheckpoint);
  fileNumber = data.fileNumber;
  startTime = data.startTime;
  console.log('Resuming at file number', fileNumber);

  // @ts-ignore
  // gUnder7set = JSON.parse(fs.readFileSync('/tmp/dr3_gUnder7set.part.json'));
  // @ts-ignore
  distanceUnder360set = JSON.parse(fs.readFileSync('/tmp/dr3_distanceUnder360set.part.json'));
}

const preloader = new AggressiveFilePreload(gaiaDir, fileList, fileNumber);
for (let len = fileList.length; fileNumber < len; fileNumber++) {
  // Create an index entry for this file.
  // indexTable.push([]);

  lineNumber = -1;
  currentFile = fileList[fileNumber];
  const fileName = gaiaDir + '/' + currentFile;
  const start = Date.now();

  console.log(`[iteration ${fileNumber}] requesting`, fileName);
  const buffer = await preloader.getNextFile();
  if (buffer !== null) {
    bufferToLineStrings(buffer as Buffer, onFindLine);
  }
  else {
    continue;
  }

  processed++;
  const loadedAfter = Date.now() - start;
  console.log(' * Process time:', loadedAfter);
  // console.log(`   gUnder7set length is ${gUnder7set.length}`);
  console.log(`   distanceUnder360set length is ${distanceUnder360set.length}`);
  console.log(`   distanceUnder360set excluding the BSC: ${distanceUnder360set.length - bscEntries.length}`);

  // Write the data being worked on and wait; it's critical for resuming on
  // crash, which Bun does often.
  // await fsAwait.writeFile('/tmp/dr3_index.part.dat', JSON.stringify(indexTable));
  // await fsAwait.writeFile('/tmp/manifest.part.json', JSON.stringify({
  //   '//': 'Processing in progress...',
  //   indexKey: columnsToIndex,
  //   timestamp: new Date().toLocaleString(),
  // }));

  const duration = Date.now() - startTime;
  const progress = (fileNumber + 1) / fileList.length;
  const totalEstimated = (((duration / progress) / 1000) / 3600).toFixed(2);
  const remainingEstimate = ((((duration / progress) - duration) / 1000) / 3600).toFixed(2);
  console.log(`\x1b[1;32m> ETA: ${remainingEstimate} of ${totalEstimated} hours remaining.\x1b[0m`);

  // Bun crashes due to memory issues around 48 files in, depending on size.
  // Do a controlled exit rather than dealing with a spontaneous crash.
  if (processed > 29) {
    // await fsAwait.writeFile('/tmp/dr3_gUnder7set.part.json', JSON.stringify(gUnder7set));
    await fsAwait.writeFile('/tmp/dr3_distanceUnder360set.part.json', JSON.stringify(distanceUnder360set));
    await fsAwait.writeFile('/tmp/dr3_position.json', JSON.stringify({
      fileNumber: fileNumber + 1,
      startTime,
    }, null, 2));
    console.log(
      'Intentionally doing clean controlled exist to prevent Bun crash. ' +
      'Please run this script in a loop.\n',
      'File index:', fileNumber,
    );
    process.exit(0);
  }
}

await Bun.write(Bun.stdout, '\n');
console.log('Writing manifest.');
fs.writeFileSync('./cache/manifest.json', JSON.stringify({
  '//': 'Do not edit this file; doing so will corrupt index cache. If ' +
    'you need to reindex the Gaia dataset, please use the ' +
    'indexCsvDir.ts script.',
  timestamp: new Date().toLocaleString(),
  indexKey: columnsToIndex
}, null, 2));

await Bun.write(Bun.stdout, '\n');
console.log('Writing distanceUnder360set.json.');
fs.writeFileSync('./cache/distanceUnder360set.json', JSON.stringify(distanceUnder360set/*, null, 2*/));

// await Bun.write(Bun.stdout, '\n');
// console.log('Writing gUnder7set.json.');
// fs.writeFileSync('./cache/gUnder7set.json', JSON.stringify(gUnder7set, null, 2));

// await Bun.write(Bun.stdout, '\n');
// console.log('Writing index file.');
// fs.writeFileSync('./cache/index.dat', JSON.stringify(indexTable));

await Bun.write(Bun.stdout, '\n');
console.log(
  skipped, `file${skipped !== 1 ? 's' : ''} skipped,`,
  processed, `file${processed !== 1 ? 's' : ''} processed.`,
);
