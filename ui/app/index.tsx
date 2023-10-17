import React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'semantic-ui-react';
// import './utils/autoReload';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';

// import fs from 'fs';
// import zlib from 'zlib';
//
// // const filePath = '/tmp/test.csv.gz';
// const filePath = '/tmp/test1.csv.gz';
// // const filePath = '/tmp/GaiaSource_000000-003111.csv.gz';
//
// // Dev note: Node has a toString() limit of 512MB. We can chunk this two ways:
// // limit to 100000000 chars (100MB), or limit by newline character. Newlines are
// // code 10 if the source is Unix, codes 13,10 if Windows, or code 13 if Mac.
// function bufferToLargeStrings(buffer: Buffer) {
//   const stringParts: string[] = [];
//   const bufferLength = buffer.length;
//   const limit = 100000000;
//   let cursorStart = 0;
//   let cursorEnd = limit;
//
//   while (cursorStart <= bufferLength) {
//     stringParts.push(buffer.subarray(cursorStart, cursorEnd).toString());
//     // Note: this is safe because Node will trim the number to prevent
//     // overflow.
//     cursorStart += limit;
//     cursorEnd += limit;
//   }
//   console.log({ stringParts });
// }
//
// // Dev note: Node has a toString() limit of 512MB. We can chunk this two ways:
// // limit to 100000000 chars (100MB), or limit by newline character. Newlines
// // are code 10 if the source is Unix, codes 13,10 if Windows, or code 13 if
// // Mac. Trial/error on smaller sets has shown DR3 datasets to use code 10 only.
// function bufferToLineStrings(buffer: Buffer) {
//   const stringParts: number[][] = [];
//   let currentLine: number[] = [];
//   let isComment = false;
//   let lineLogCount = 0;
//   for (let i = 0, len = buffer.length; i < len; i++) {
//     const char = buffer[i];
//
//     if (isComment) {
//       if (char === 10) {
//         // Found a line break. Stop treating as comment.
//         isComment = false;
//       }
//       continue;
//     }
//
//     if (char === 35 && currentLine.length === 0) {
//       // Found a # at beginning of line; ignore until end of line.
//       isComment = true;
//       continue;
//     }
//
//     if (char === 10) {
//       // Found a line break; save the line if not empty.
//       /*if (currentLine[0] === 35) {
//         // 35 is a #, i.e. a comment. Reject.
//         currentLine = [];
//       }
//       else if*/
//       if (currentLine.length) {
//         stringParts.push(currentLine);
//         currentLine = [];
//         if (++lineLogCount === 10000) {
//           lineLogCount = 0;
//           console.log('Found', stringParts.length, 'items.');
//         }
//       }
//     }
//     else {
//       currentLine.push(char);
//     }
//   }
//   console.log({ stringParts });
//   return stringParts;
// }
//
// fs.readFile(filePath, (error, data) => {
//   console.log('file read:', { error });
//   console.log('starting deflate...');
//   let start = performance.now();
//   zlib.gunzip(data, (error, result) => {
//     console.log('file deflate:', { error });
//     console.log('deflate buffer:', result);
//     console.log('deflation time:', performance.now() - start);
//
//     start = performance.now();
//     bufferToLineStrings(result);
//     console.log('Time taken:', performance.now() - start);
//   });
// });

let noise = 'Ctf73qKtoI9sxa0PacP45eX0VfeCPC1QL8hMHpQ0srde23sYgfgo0jIjuv8vTu2NM3Kz86o8cG1yBnDboUmis5OIAXK4CdzC08NzHS7hz9nDxKl0YKq42JFTwRGVO85tbVIEgPlvFvM5hv5vkljJrxmqF1ClISOZfL1W5noI8ixS4p5x1AbowAi5rZdzISP6v7zhXtf1VATZGb7Y00tprlkedDKz85L8fplZ4c1I9aJ83l9CCD5AF7fwPLqngpoo86H1vxkDkQb4y8pN80WPMhi5juihe0pHNSFn848XA5rkz5R3YzPf1k5gOFMQ5dA6FtkxB1mO3X0hUdW4oo2gWP2cKRhK9b2qlemEoBdq9VWCcWuJf4yeGAMt4uODCQs6Y0ZQeoqU9nI9gagixagjACy6ClMRH5tfOeYVBCy0r8t1ZJEagLl9D2H66two4AKv2x0gwREcgM6Ah60Sp36nObmWX9bO3k1bT5QSHXeO3cTNbL6RM81xvEy6O6SBK9yvrehN0nvZGomsn56BhCS39pJEy0HEmNsS7oXJpvK83P3PUAL160dyYPkN8t18UQAAou4KMQnI2RdzjEdaSuuOX5UIDXA5rtIhOE3kYDh0VmcHhwxr7VKzlNkrBBURS3oQ76akAl2EitMQGthJh9MN7s0sREjQ6O5PDKHflT2HimXhZp4cDXtKuxkIMYq3Bm5GiZvTW9F14BveQ91u6Tv2SzhuvLR7FLXW3Foga9Izpha0uoLJb88rs6UE1sjJKKuz3KdgzggF2Upu75gJkeQHz5BjseSdyboBn9iP2O0XrHtMAJ0CP9x87nJ8UxUpK7c4zOHDzoIdXO2X8bGsR6b7nfOZxKl3eq6nPvlb3g2JALDpFyU1gtDtXUnG5ySlogMBj63MNMUmqk7LE90KEs6UMioidQSqUWG8CntOw1FBWwhnMwzj1wCSji4Pf83Zp88ojzu7idqN3O81le7uFMFt9cqp9R6VoxpyVVOiDL5DB25vgp2LS5dvMsdy18cxrGAe5yJa9smKe8N0vxGnztt1VJFlLArl5hbQvyq6uCinCP0mzTKpgrp93MWt79MbY1RQNp1xh1kGArb3AIbv3N6TTYMWZ6lxFCgLzRlP3oyI09I6F86qSzCCWukDLw6UHPOyUCMy1Sir8zeiUJcU0pzvRRTXf7Baihtaq7XDoB7D0VvoDiHmed7vb5THy4XPVNPpQ3U7TH7kzEmWXKCS3fe3fwSAR0JQv7Oc0ZAWLfW6SqL5d';
noise = `${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}`;
noise = `${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}${noise}`;

function printMemUsage() {
  const stats = process.memoryUsage();
  console.group('Memory usage');
  console.log('[rss]       Main memory use:', stats.rss / 1024 / 1024 / 1024);
  console.log('[heapTotal] V8 usage:', stats.heapTotal / 1024 / 1024 / 1024);
  console.log('[heapUsed]  V8 usage:', stats.heapUsed / 1024 / 1024 / 1024);
  console.log('[external]  C++ objects bound to JS:', stats.external / 1024 / 1024 / 1024);
  console.log('[ab]        Array buffer usage:', stats.arrayBuffers / 1024 / 1024 / 1024);
  console.log();
  console.groupEnd();
}

printMemUsage();

const array: string[] = [];
function accumulate() {
  for (let i = 0, len = 10000000; i < len; i++) {
    array.push(`--------${Math.random()}${noise}--------`);
  }
  console.log('Array size is', array.length);
  printMemUsage();
  console.log('Waiting 1 second.');
  setTimeout(accumulate, 1000);
}

console.log('starting.');
accumulate();

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
