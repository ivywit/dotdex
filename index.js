const DotDex = require('./lib/dotdex');

function getAction (action, attribute, path) {
  switch (action) {
  case 'init':
    return DotDex.init;
  case 'list':
    return DotDex.list;
  case 'update':
    return function () { return DotDex.update(attribute, path); }
  case 'drop':
    return function () { return DotDex.drop(attribute); }
  case 'push':
    return DotDex.push;
  case 'pull':
    return DotDex.pull;
  default:
    return DotDex.showHelp;
  }
}

async function main () {
  const action = process.argv[2];
  const attribute = process.argv[3];
  const path = process.argv[4];
  const userAction = getAction(action, attribute, path);
  const exitCode = await userAction();
  process.exit(exitCode);
}

main();

