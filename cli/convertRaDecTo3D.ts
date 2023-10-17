// Converts all json files in the specified directory from RA/Dec to 3D
// positions. Saves the result in 'cache/3d positions'. It expects JSON files
// in the format as output by https://github.com/frostoven/BSC5P-JSON-XYZ

import fs from 'fs';
import project3d from '@frostoven/alkalurops/project3d';
import console from 'console';

// -- args parsing ---------------------------------------------- //

const cliOptions = Bun.argv[2];
let options: any;

function usage() {
  console.error('Example:\nbun cli/convertRaDecTo3D.ts \'' + JSON.stringify({
    jsonDir: '/cache/json_files',
  }) + '\'');
}

(function checkArgs() {
  try {
    options = JSON.parse(cliOptions);
    if (!fs.statSync(options.jsonDir).isDirectory()) {
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

const { jsonDir } = options;

const outDir = './cache/3D positions';
fs.mkdirSync(outDir, { recursive: true });

// -- main section ---------------------------------------------- //

const fileList = fs.readdirSync(jsonDir);

// Rewrites the specified datasource in-place.
function convertTo3d(logId: string, data: [{}]) {
  for (let i = 0, len = data.length; i < len; i++) {
    if (i > 0 && i % 10000 === 0) {
      console.log(` * ${logId}:`, i, `entries processed...`);
    }
    const line: any = data[i];
    const { x, y, z } = project3d({
      rightAscension: line.r,
      declination: line.d,
      distance: line.p,
    });

    delete line.r;
    delete line.d;

    line.x = x;
    line.y = y;
    line.z = z;
  }
}

for (let i = 0, len = fileList.length; i < len; i++) {
  const fileName = fileList[i];
  const filePath = jsonDir + '/' + fileName;
  const extension = filePath.slice(-5);
  if (extension !== '.json') {
    console.log(` * Skipping '${filePath}' - unrecognised extension.`);
    continue;
  }

  console.log('-> Loading', filePath);
  // @ts-ignore
  const data = JSON.parse(fs.readFileSync(filePath));
  convertTo3d(fileName, data);
  const outLocation = outDir + '/' + fileName.replace('.json', '.min.json');
  console.log('-> Saving', outLocation);
  fs.writeFileSync(outLocation, JSON.stringify(data));
}

console.log('Done.');
