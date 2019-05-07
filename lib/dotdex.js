const fs = require('fs');
const util = require('util');
const ncp = require('ncp').ncp;
const rimraf = require('rimraf');
const git = require('simple-git/promise');
const Config = require('./config');

const copy = util.promisify(ncp);
const rmrf = util.promisify(rimraf);
const path = '/tmp/dotdex';

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
      await Config.load();
      // copy files
      await git().clone(Config.repo, path);
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      const keys = Object.keys(Config.files);
      
      for (const index in keys) {
        const key = keys[index];
        await copy(Config.files[key].replace('~', process.env.HOME), `${path}/${key}`);
      }

      if (!fs.existsSync(`${path}/.git`)) {
        await git(path).init();
        await git(path).addRemote('origin', Config.repo);
      }
      await git(path).add(keys);
      await git(path).commit(`updated files on ${new Date()}`);
      await git(path).push('origin', 'master');
      await rmrf(path);
    } catch (error) {
      console.error(error);
    }
  },

  pull: async function () {
    try {
      await Config.load();
      // copy files
      await git().clone(Config.repo, path);
      if (fs.existsSync(path)) {
        await Config.load(`${path}/dotdex`);

        const keys = Object.keys(Config.files);
        
        for (const index in keys) {
          const key = keys[index];
          await copy(`${path}/${key}`, Config.files[key].replace('~', process.env.HOME));
        }
        
        await rmrf(path);
      }
    } catch (error) {
      console.error(error);
    }    
  },
}

module.exports = DotDex;
