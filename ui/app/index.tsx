import React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react';
import './utils/autoReload';

import fs from 'fs';
import zlib from 'zlib';

// const filePath = '/tmp/test.csv.gz';
const filePath = '/tmp/test1.csv.gz';
// const filePath = '/tmp/GaiaSource_000000-003111.csv.gz';

// Dev note: Node has a toString() limit of 512MB. We can chunk this two ways:
// limit to 100000000 chars (100MB), or limit by newline character. Newlines are
// code 10 if the source is Unix, codes 13,10 if Windows, or code 13 if Mac.
function bufferToLargeStrings(buffer: Buffer) {
  const stringParts: string[] = [];
  const bufferLength = buffer.length;
  const limit = 100000000;
  let cursorStart = 0;
  let cursorEnd = limit;

  while (cursorStart <= bufferLength) {
    stringParts.push(buffer.subarray(cursorStart, cursorEnd).toString());
    // Note: this is safe because Node will trim the number to prevent
    // overflow.
    cursorStart += limit;
    cursorEnd += limit;
  }
  console.log({ stringParts });
}

// Dev note: Node has a toString() limit of 512MB. We can chunk this two ways:
// limit to 100000000 chars (100MB), or limit by newline character. Newlines are
// code 10 if the source is Unix, codes 13,10 if Windows, or code 13 if Mac.
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
  console.log({ stringParts });
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

class RootNode extends React.Component {
  render() {
    return (
      <div>
        <Button>test112</Button>
      </div>
    )
  }
}

window.onload = () => {
  ReactDOM.render(
    <RootNode />,
    document.getElementById('reactRoot'),
  );
};
