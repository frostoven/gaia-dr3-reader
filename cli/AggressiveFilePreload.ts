import fs from 'fs/promises';
import console from 'console';
import {readZippedFilePromise} from './readZippedFile';

// The purpose of this class is to load new files behind the scenes while the
// current file is being processed. This is to eliminate file overhead, which
// is extremely high (700MB needs to be copied from disk into RAM before any
// processing can start).<br><br>
//
// People often incorrectly call Node.js single-threaded. In truth,
// asynchronous I/O calls in Node.js transparently spawn OS threads. This means
// we can load files into RAM while the Node event loop is 100% occupied with
// CSV processing, effectively giving us a dual-thread setup.
class AggressiveFilePreload {
  public maxFilesToPreload = 2;
  private _fileIndex: number = -1;
  private _preloadInProgress: boolean = false;
  private _gaiaDir: string;
  private readonly _fileList: string[] = [];
  private _requests: {
    resolve: Function,
    reject: Function
  }[] = [];
  private _filesLoaded: (Buffer | null)[] = [];

  constructor(gaiaDir: string, fileList: string[]) {
    this._gaiaDir = gaiaDir;
    this._fileList = fileList;
    this.triggerFileLoad().catch(console.error);
  }

  getNextFile() {
    // If a file already exists in _filesLoaded, resolve immediately with that
    // file.
    const buffer = this._filesLoaded.shift();
    if (buffer) {
      setImmediate(this.triggerFileLoad.bind(this));
      return new Promise((resolve) => {
        resolve(buffer);
      });
    }

    setImmediate(this.triggerFileLoad.bind(this));
    return new Promise((resolve, reject) => {
      this._requests.push({ resolve, reject });
    });
  }

  // If max preload has not been met, loads a file into RAM. Once the file has
  // been loaded into RAM, checks if something is waiting for it, and feeds the
  // waiting function the file.
  async triggerFileLoad() {
    const index = ++this._fileIndex;
    if (index >= this._fileList.length) {
      console.log('* No more files left to preload.');
      return;
    }

    if (this._filesLoaded.length >= this.maxFilesToPreload)  {
      console.log('* Pausing preload; have', this._filesLoaded, ' already waiting.');
      return;
    }

    if (this._preloadInProgress) {
      return;
    }
    this._preloadInProgress = true;

    const fileName = this._gaiaDir + '/' + this._fileList[index];
    let buffer: Buffer | null;

    const extPart = fileName.slice(-4);

    const stat = await fs.stat(fileName);
    if (stat.isDirectory()) {
      console.log('* Skipping', fileName, '- target is a directory.');
      buffer = null;
    }
    else if (extPart === '.csv') {
      console.log(`* Preloading ${fileName}.`);
      buffer = await fs.readFile(fileName);
    }
    else if (extPart === 'v.gz') {
      console.log(`* Preloading ${fileName}.`);
      buffer = await readZippedFilePromise(fileName);
    }
    else {
      console.log('* Skipping', fileName, '- extension not recognized.');
      buffer = null;
    }

    const request = this._requests.shift();
    this._preloadInProgress = false;
    setImmediate(this.triggerFileLoad.bind(this));

    // Give the node event loop some time to thread the next fs event. This is
    // a poor solution and will fail on some systems, depending on load. We
    // probably need some callback mechanism instead. For now this works on my
    // machine and actually *drastically* improves indexing time for me
    // personally.
    setTimeout(() => {
      if (request) {
        buffer !== null && console.log('*', fileName, 'preloaded. Releasing immediately.');
        request.resolve(buffer);
      }
      else {
        buffer !== null && console.log('*', fileName, 'preloaded. Storing until needed.');
        this._filesLoaded.push(buffer);
      }
    }, 5);
  }
}

export {
  AggressiveFilePreload,
}
