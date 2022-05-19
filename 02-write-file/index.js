// import process from 'node:process';
const fs = require('fs');
const path = require('path');
const currentPath = path.join(__dirname, 'text.txt');
const { stdin } = process;

// Begin reading from stdin so the process does not exit.
process.stdin.resume();
console.log('hello, you can write something here, and I add it to text.txt');
const output = fs.createWriteStream(currentPath, 'utf-8');

output.on('error', error => console.log('Something`re going wrong, look at this error', error.message));
stdin.on('error', error => console.log('Something is going wrong, look at this error', error.message));

process.on('SIGINT', () => {
    console.log('Thank you! Goodbye');
    process.exit();
});

stdin.on('data', data => {
    if (data.toString().trimEnd() !== 'exit') {
        output.write(data.toString());

    } else {
        console.log('Thank you! Goodbye');
        process.exit();
    }
});