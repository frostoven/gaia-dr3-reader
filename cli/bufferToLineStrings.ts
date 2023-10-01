import * as console from 'console';

function bufferToLineStrings(buffer: Buffer, onFindLine: Function/*, onLogicalChar: Function*/) {
  // const stringParts: number[][] = [];
  let currentLine: number[] = [];
  let isComment = false;
  let lineLogCount = 0;
  let totalLines = 0;
  // The start of the current line.
  let lineOffset = 0;
  let columnOffsets: number[] = [];
  for (let i = 0, len = buffer.length; i < len; i++) {
    const char = buffer[i];

    if (isComment) {
      // We can ignore 13; these files use 10 only.
      if (char === 10 /*|| char === 13*/) {
        lineOffset = i + 1;
        isComment = false;
      }
      continue;
    }

    // Assume hashes don't exist within normal data.
    if (char === 35 && currentLine.length === 0) {
      isComment = true;
      continue;
    }

    // Note the positions of all columns.
    if (char === 44) {
      columnOffsets.push(i - lineOffset + 1);
    }

    if (char === 10 /*|| char === 13*/) {
      /*if (currentLine[0] === 35) {
        // 35 is a #, i.e. a comment. Reject.
        currentLine = [];
      }
      // We should normally line length if the source is unknown, but
      // these files do not contain empty lines.
      else*/
      if (currentLine.length) {
        // stringParts.push(currentLine);
        columnOffsets.push(i - lineOffset + 1);
        onFindLine(currentLine, lineOffset, columnOffsets);
        lineOffset = i + 1;
        columnOffsets = [ i - lineOffset + 1 ];
        currentLine = [];
        totalLines++;
        if (++lineLogCount === 10000) {
          lineLogCount = 0;
          // console.log('Found', stringParts.length, 'items.');
          console.log('Found', totalLines, 'items.');
        }
      }
    }
    else {
      currentLine.push(char);
      // onLogicalChar(char);
    }
  }
  // console.log({ stringParts });
  // return stringParts;
}

export {
  bufferToLineStrings,
};
