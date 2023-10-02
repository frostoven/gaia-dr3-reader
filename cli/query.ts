import fs from 'fs';
import process from 'process';
import * as console from 'console';

// @ts-ignore
const indexTable = JSON.parse(fs.readFileSync('./cache/index.dat'));
const entryCount = indexTable.length;
// @ts-ignore
const { indexKey } = JSON.parse(fs.readFileSync('./cache/manifest.json'));

const gaiaDir = './cache/extracts';

// for (let fileNumber = 0; fileNumber < entryCount; fileNumber++) {
//   const
// }

// Searches for a star by its Gaia DR3 name.
function findByDesignation(name: string) {
  return findBy('designation', name);
}

// Searches for a star by cultural name, such as Sirius.
function findByAlias(name: string) {
  // Load BSC names here.
  // TODO might be able to optimise this by ignoring -1. maybe call it
  //  stand-alone instead of via generic findBy?
}

function findBy(indexName: string, value: any, /*whereColumn: string, hasValue: any*/) {
  // TODO: look up the indexKey number from the manifest, then loop the index
  //  points.
  let keyNumber = indexKey.indexOf(indexName);
  if (keyNumber === -1) {
    console.error('Error: requested key not indexed.');
    process.exit(1);
  }
  const queryStartTime = Date.now();

  // Keys start at position 2. 0 is the line offset and 1 is the line length.
  keyNumber += 2;

  const fileList = fs.readdirSync(gaiaDir);
  for (let fileNumber = 0; fileNumber < entryCount; fileNumber++) {
    // fs.fstatSync(fd, ...
    // fs.readSync(fd, buffer, offset, length, position ...
    const fileName = gaiaDir + '/' + fileList[fileNumber];
    console.log('Querying file', fileName);
    const startTime = Date.now();

    const descriptor: number = fs.openSync(fileName, 'r');
    const fstat = fs.fstatSync(descriptor);
    const fileIndex = indexTable[fileNumber];
    let lineModCount = 0;
    for (let i = 0, len = fileIndex.length; i < len; i++) {
      // if (++lineModCount === 1000) {
      //   console.log(i + 1, 'lines processed.');
      //   lineModCount = 0;
      // }
      const lineInfo = fileIndex[i];
      if (lineInfo[0] === -1) {
        // This is header line.
        continue;
      }
      const [ lineOffset, lineLength ] = lineInfo;
      // const bscNameIndex = lineInfo[lineLength.length - 1];
      const columnOffsets = lineInfo[keyNumber];
      const start = lineOffset + columnOffsets[0];
      const cellLength = columnOffsets[1] - columnOffsets[0];
      // console.log({ keyNumber, lineInfo, lineOffset, lineLength, columnOffsets, start, cellLength });
      const buffer = Buffer.alloc(cellLength);
      fs.readSync(descriptor, buffer, 0, cellLength, start);
      // console.log('Cell:', buffer.toString());
      // console.log(`${buffer.toString()} === ${value} ? `, buffer.toString() === value);
      if (buffer.toString() === value) {
        console.log(`Total query time: ${Date.now() - queryStartTime}ms.`);
        return lineInfo;
      }
    }

    console.log(`Querying ${fileName} took ${Date.now() - startTime}ms; nothing found.`);
  }
  console.log(`Total query time: ${Date.now() - queryStartTime}ms; nothing found.`);
}

const result = findBy('designation', '"Gaia DR3 5930906457752169600"');
console.log('Result:', result);
