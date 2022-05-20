const fs = require('fs');
const path = require('path');
const searchingFolder = path.join(__dirname, '\\secret-folder');

fs.readdir(searchingFolder,
    { withFileTypes: true },
    (err, files) => {
        console.log("\nFiles in directory",searchingFolder,':');
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile()) {
                    (async () => {
                        const stats = await fs.promises.stat(path.join(searchingFolder,file.name));
                        console.log(path.parse(file.name).name, '-', path.parse(file.name).ext.slice(1), '-', stats.size/1024,'kb')
                        return stats.size;
                    })().catch(console.error);
                }
                
            })
        }
    })