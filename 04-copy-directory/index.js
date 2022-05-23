const fs = require('fs');
const path = require('path');

const filesCopyFolder = path.join(__dirname,'files-copy');
const targetCopyFolder = path.join(__dirname,'files');

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

  (async () => {
    console.log('\nStart copy folder -->');
    await fs.promises.rm(filesCopyFolder, { recursive: true, force: true });
    await fs.promises.mkdir(filesCopyFolder, { recursive: true });
    await copy(targetCopyFolder, filesCopyFolder);
    await console.log('--> Succesfully finished copying folder\n');
  })();