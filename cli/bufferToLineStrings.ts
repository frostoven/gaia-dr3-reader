import { call } from 'three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements';
import * as console from "console";

function bufferToLineStrings(buffer: Buffer, callback: Function) {
    // const stringParts: number[][] = [];
    let currentLine: number[] = [];
    let isComment = false;
    let lineLogCount = 0;
    let totalLines = 0;
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
                // stringParts.push(currentLine);
                callback(currentLine);
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
        }
    }
    // console.log({ stringParts });
    // return stringParts;
}

export {
  bufferToLineStrings,
}
