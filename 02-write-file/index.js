const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fileStream = fs.createWriteStream('./02-write-file/input.txt', {
  flags: 'a',
});
console.log('Welcome! Type something and press Enter. Type "exit" to stop.');

function handleInput(input) {
  fileStream.write(`${input}\n`);
}

rl.setPrompt('>');
rl.prompt();

rl.on('line', (line) => {
  if (line.toLowerCase() === 'exit') {
    console.log('Exiting...');
    rl.close();
    fileStream.end();
  } else {
    handleInput(line);
  }
});
