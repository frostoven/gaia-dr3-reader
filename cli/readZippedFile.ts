import fs from 'fs';
import zlib from 'zlib';
import { bufferToLineStrings } from './bufferToLineStrings';

function readZippedFile(filePath: string, callback: Function) {
  fs.readFile(filePath, (error, data) => {
    // console.log('file read error:', { error });
    // console.log('starting deflate...');
    let start = performance.now();
    zlib.gunzip(data, (error, result) => {
      // console.log('file deflate error:', { error });
      // console.log('deflate buffer:', result);
      // console.log('deflation time:', performance.now() - start);
      //
      // start = performance.now();
      // bufferToLineStrings(result);
      // console.log('Time taken:', performance.now() - start);
      callback(result);
    });
  });
}

function readZippedFileSync(filePath: string) {
  const data = fs.readFileSync(filePath);
  // console.log('starting deflate...');
  let start = performance.now();
  return zlib.gunzipSync(data);
  // // console.log('deflate buffer:', result);
  // console.log('deflation time:', performance.now() - start);
  //
  // start = performance.now();
  // bufferToLineStrings(result);
  // console.log('Time taken:', performance.now() - start);
  // return result;
}

export {
  readZippedFile,
  readZippedFileSync,
}
