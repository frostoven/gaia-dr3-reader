// Test made to compare Bun to NW.js.
//
// Deflation:                             | Sorting:
// ---------------------------------------+-----------------------------------------------------
// NW.js takes 5.784 seconds to deflate.  | NW.js takes 19.964 seconds to sort bytes into lines.
// Bun takes 5.170 seconds to deflate.    | Bun takes 5.359 seconds to sort bytes into lines.

import fs from 'fs';
import zlib from 'zlib';

// const filePath = '/tmp/test.csv.gz';
const filePath = '/tmp/test1.csv.gz';

// Dev note: Node has a toString() limit of 512MB. We can chunk this two ways:
// limit to 100000000 chars (100MB), or limit by newline character. Newlines are
// code 10 if the source is Unix, codes 13,10 if Windows, or code 13 if Mac.
// For this case I'm choosing 100MB chunking.
function bufferToLineStrings(buffer: Buffer) {
  const stringParts: number[][] = [];
  let currentLine: number[] = [];
  let isComment = false;
  let lineLogCount = 0;
  for (let i = 0, len = buffer.length; i < len; i++) {
    const char = buffer[i];

    if (isComment) {
      if (char === 10 || char === 13) {
        isComment = false;
      }
      continue;
    }

    if (char === 35 && currentLine.length === 0) {
      isComment = true;
      continue;
    }

    if (char === 10 || char === 13) {
      /*if (currentLine[0] === 35) {
        // 35 is a #, i.e. a comment. Reject.
        currentLine = [];
      }
      else*/ if (currentLine.length) {
        stringParts.push(currentLine);
        currentLine = [];
        if (++lineLogCount === 10000) {
          lineLogCount = 0;
          console.log('Found', stringParts.length, 'items.');
        }
      }
    }
    else {
      currentLine.push(char);
    }
  }
  // console.log({ stringParts });
  return stringParts;
}

fs.readFile(filePath, (error, data) => {
  console.log('file read:', { error });
  console.log('starting deflate...');
  let start = performance.now();
  zlib.gunzip(data, (error, result) => {
    console.log('file deflate:', { error });
    console.log('deflate buffer:', result);
    console.log('deflation time:', performance.now() - start);

    start = performance.now();
    bufferToLineStrings(result);
    console.log('Time taken:', performance.now() - start);
  });
});
