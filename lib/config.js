const fs = require('fs');
const { promisify } = require('util');
const { question } = require('./utils');

const writeFile = promisify(fs.writeFile);
const readFile = fs.readFileSync;

async function structure ({ repo, files }) {
  try {
    return await JSON.stringify(({ repo, files }))
  } catch (error) {
    console.error(error);
    return 1;
  }
}

async function write (path, contentString) {
  try {
    await writeFile(path, contentString);
  } catch (error) {
    console.error(error);
    return 1;
  }
}

async function read (path) {
  try {
    const exists = fs.existsSync(path);
    const file = exists ? readFile(path, {encoding: 'utf8'}) : '{}';
    return await JSON.parse(file);
  } catch (error) {
    console.error(error);
    return 1;
  }
}

const Config = {
  create: async function () {
    try {
      this.repo = await question('dotfile git repo: ');
      this.files = {
        dotdex: '~/.dotdex.json'
      };
      const json = await this.toJson();
      await write(this.path, json);
      return 0;
    } catch (error) {
      console.error(error);
      return 1;
    }
  },

  load: async function (original = null) {
    try {
      const current = await read(original ? original : this.path);
      this.repo = current.repo;
      this.files = Object.assign({}, this.files, current.files);
      return 0;
    } catch (error) {
      console.error(error);
      return 1;
    } 
  },
  
  update: async function (key, value) {
    try {
      await this.load();
      const isRepo = key.toLowerCase() === 'repo';
      this.repo = isRepo ? value : this.repo ;
      this.files = isRepo ? this.files : Object.assign({}, this.files, { [key]: value.replace(process.env.HOME, '~') });
      const json = await this.toJson();
      await write(this.path, json);
      return 0;
    } catch (error) {
      console.error(error);
      return 1;
    }
  },
  
  remove: async function (key) {
    try {
      await this.load();
      const { [key]: drop, ...files } = this.files;
      this.files = Object.assign({}, files);
      const json = await this.toJson();
      await write(this.path, json);
      return 0;
    } catch (error) {
      console.error(error);
      return 1;
    }
  },

  toJson: async function () {
    return await structure(this);
  },

  print: async function () {
    try {
      const exists = fs.existsSync(this.path);
      const current = exists ? await read(this.path) : {};
      const contents = await JSON.stringify(current, null, 2);
      console.log(contents);
      return 0;
    }  catch (error) {
      console.error(error);
      return 1;
    }
  },
  
  path: `${process.env.HOME}/.dotdex.json`
}

module.exports = Config;
