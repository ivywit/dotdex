const readline = require('readline');

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const Utils = {  
  question: function (askString) {
    return new Promise((resolve) => {
      return interface.question(askString, (answer) => resolve(answer));
    });
  },
}

module.exports = Utils;
