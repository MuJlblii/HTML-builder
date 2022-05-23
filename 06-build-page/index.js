const fs = require('fs');
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const destinationFolder = path.join(__dirname, 'project-dist');

const assetsCopyToFolder = path.join(destinationFolder, 'assets');
const assetsCopyFromFolder = path.join(__dirname, 'assets');

const searchingFolder = path.join(__dirname, 'components');


async function copy(CopyFromFolder, CopyToFolder) {
  await fs.promises.mkdir(CopyToFolder, { recursive: true });
  fs.readdir(CopyFromFolder,
    { withFileTypes: true },
    async (err, files) => {
      if (err)
        console.log(err);
      else {
        for (const file of files) {
          if (file.isFile()) {
            await fs.promises.copyFile(path.join(CopyFromFolder, file.name), path.join(CopyToFolder, file.name));
          } else {
            await copy(path.join(CopyFromFolder, file.name), path.join(CopyToFolder, file.name));
          }
        }
      }
    });
}

//___________________________________________________________________________________________________

async function createBundle(file) {
  if (file.isFile() && path.parse(file.name).ext.slice(1) === 'css') {
    const readableStream = await fs.promises.readFile(path.join(styleFolder, file.name), 'utf-8');
    await fs.promises.appendFile(path.join(destinationFolder, 'style.css'), readableStream);
  }
}

async function cssBundleCreate() {
  fs.readdir(styleFolder,
    { withFileTypes: true },
    async (err, files) => {
      if (err)
        console.log(err);
      else {
        fs.rm(path.join(destinationFolder, 'style.css'), { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(err);
          }
        });
        for (const file of files) {
          await createBundle(file);
        }
      }
    });
}

async function createHTMLBundle() {
  fs.readdir(searchingFolder,
    { withFileTypes: true },
    async (err, files) => {
      if (err)
        console.log(err);
      else {
        for (const file of files) {
          if (file.isFile()) {
            await writeHTMLTags(path.parse(file.name).name);
          }
        }
      }
    });
}

async function writeHTMLTags(nameComponents) {
  const  readableStream = await fs.promises.readFile(path.join(destinationFolder, 'index.html'), 'utf-8');
  const insertComponents = await fs.promises.readFile(path.join(__dirname, 'components', nameComponents + '.html'), 'utf-8');
  const newHTML = readableStream.replace(`{{${nameComponents}}}`, insertComponents);
  await fs.promises.writeFile(path.join(destinationFolder, 'index.html'), newHTML);

}

(async () => {
  console.log('\nStart creat bundle -->');
  await fs.promises.rm(destinationFolder, { recursive: true, force: true });
  await fs.promises.mkdir(destinationFolder, { recursive: true });
  await fs.promises.mkdir(assetsCopyToFolder, { recursive: true });
  await copy(assetsCopyFromFolder, assetsCopyToFolder);
  await cssBundleCreate();
  await fs.promises.copyFile(path.join(__dirname, 'template.html'), path.join(destinationFolder, 'index.html'));
  await createHTMLBundle();
  await console.log('--> Succesfully finished creating bundle\n');
})();