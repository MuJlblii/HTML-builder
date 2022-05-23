const fs = require('fs');
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const destinationFolder = path.join(__dirname, 'project-dist');

async function createBundle(file) {
  if (file.isFile() && path.parse(file.name).ext.slice(1) === 'css') {
    const readableStream = await fs.promises.readFile(path.join(styleFolder, file.name), 'utf-8');
    await fs.promises.appendFile(path.join(destinationFolder, 'bundle.css'), readableStream);
  }
}

async function cssBundleCreate() {
  fs.readdir(styleFolder,
    { withFileTypes: true },
    async (err, files) => {
      if (err)
        console.log(err);
      else {
        fs.rm(path.join(destinationFolder, 'bundle.css'), { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(err);
          }
        });
        for (const file of files) {
          await createBundle(file);
        }
        console.log('Bundle has been created');
      }
    });
}

cssBundleCreate();