const fs = require('fs');
const path = require('path');

const filesCopyFolder = path.join(__dirname,'files-copy');
const targetCopyFolder = path.join(__dirname,'files');

async function copy() {
    const removeFolder = await fs.promises.rm(filesCopyFolder, {recursive: true, force: true});
    const requireFolder = await fs.promises.mkdir(filesCopyFolder, {recursive: true});
    fs.readdir(targetCopyFolder,
        { withFileTypes: true },
        (err, files) => {
            if (err)
                console.log(err);
            else {
                files.forEach(file => {
                    if (file.isFile()) {
                        (async () => {
                            const copyFile = await fs.promises.copyFile(path.join(targetCopyFolder,file.name),path.join(filesCopyFolder,file.name))
                        })().catch(console.error);
                    }
                    
                })
                console.log('copied folder');
            }
        })
} 

copy();