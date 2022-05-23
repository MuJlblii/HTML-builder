// import process from 'node:process';
const fs = require('fs');
const path = require('path');
const currentPath = path.join(__dirname, 'text.txt');
const { stdin } = process;

process.stdin.resume();
console.log('_________________\nHello, you can type something here, and I add it to text.txt');
console.log('---> ** for exit you can press Ctrl+C or type "exit"');
const output = fs.createWriteStream(currentPath, 'utf-8');

output.on('error', error => console.log('Something`re going wrong, look at this error', error.message));
stdin.on('error', error => console.log('Something is going wrong, look at this error', error.message));

process.on('SIGINT', () => {
  console.log('_________________\nThank you! Goodbye');
  process.exit();
});

stdin.on('data', data => {
  if (data.toString().trim().toUpperCase() !== 'EXIT') {
    output.write(data.toString());
  } else {
    console.log('_________________\nThank you! Goodbye');
    process.exit();
  }
});