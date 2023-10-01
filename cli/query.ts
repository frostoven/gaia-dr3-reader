import fs from 'fs';

// @ts-ignore
const indexTable = JSON.parse(fs.readFileSync('./cache/index.dat'));
const entryCount = indexTable.length;
// @ts-ignore
const manifest = JSON.parse(fs.readFileSync('./cache/manifest.json'));

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
}

function findBy(indexKey: string, value: any) {
  // TODO: look up the indexKey number from the manifest, then loop the index
  //  points.
}
