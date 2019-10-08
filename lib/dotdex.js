const fs = require('fs');
const util = require('util');
const ncp = require('ncp').ncp;
const rimraf = require('rimraf');
const git = require('simple-git/promise');
const Config = require('./config');

const copy = util.promisify(ncp);
const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);
const path = '/tmp/dotdex';

async function cleanTemp() {
  if (fs.existsSync(path)) return await rmrf(path);
  return null;
}

const DotDex = {
  showHelp: function () {
    process.stdout.write(
      `
  Usage:

        dotdex <command> [attribute] [path]

  Commands:
        init -- create new dotdex
        list -- list watched files
        update <program> <path> -- update attribute with new path
        drop <program> -- remove dot file from dotdex
        push -- push local dot files to repo
        pull -- pull remote dot files from repo

`
    );
    process.exit(0);
  },

  init: async function () {
    return Config.create();    
  },

  list: async function() {
    return Config.print();
  },

  update: async function (attribute, path) {
    return Config.update(attribute, path);
  },

  drop: async function (attribute) {
    return Config.remove(attribute);
  },

  push: async function () {
    try {
      await cleanTemp();
      
      Config.load();
      // copy files
      await git().clone(Config.repo, path);
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      const files = fs.readdirSync(path);
      const keys = Object.keys(Config.files);

      for (const index in files) {
        const file = files[index];
        if (file !== '.git') {
          await rmrf(`${path}/${file}`);
        }
      }

      for (const index in keys) {
        const key = keys[index];
        await copy(Config.files[key].replace('~', process.env.HOME), `${path}/${key}`);
      }

      if (!fs.existsSync(`${path}/.git`)) {
        await git(path).init();
        await git(path).addRemote('origin', Config.repo);
      }
      await git(path).add('./*');
      await git(path).commit(`updated files on ${new Date()}`);
      await git(path).push('origin', 'master');
      await rmrf(path);
    } catch (error) {
      console.error(error);
    }
  },

  pull: async function () {
    try {
      await cleanTemp();

      Config.load();
      
      await git().clone(Config.repo, path);
      if (fs.existsSync(path)) {
          if (fs.existsSync(`${path}/dotdex`)) Config.load(`${path}/dotdex`, true);

        const keys = Object.keys(Config.files);
        
        for (const index in keys) {
          const key = keys[index];
	  const file = Config.files[key].replace('~', process.env.HOME);
	    const filePath = file.split('/').slice(0, -1).join('/');
	  if (!fs.existsSync(filePath)) await mkdir(filePath, {recursive: true})  
          await copy(`${path}/${key}`, file);
        }
        
        await rmrf(path);
      }
    } catch (error) {
      console.error(error);
    }    
  },
}

module.exports = DotDex;
