const fs = require('fs');
const path = require('path');
let currentPath = path.join(__dirname,'text.txt');
const readableStream = fs.createReadStream(currentPath, 'utf-8');
readableStream.on('data', chunk => console.log(chunk));