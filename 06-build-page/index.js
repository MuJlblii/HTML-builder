const fs = require('fs');
const path = require('path');

const styleFolder = path.join(__dirname, 'styles');
const destinationFolder = path.join(__dirname, 'project-dist');

// const filesCopyFolder = path.join(__dirname, 'project-dist');
const assetsCopyToFolder = path.join(destinationFolder, 'assets');
const assetsCopyFromFolder = path.join(__dirname, 'assets');

async function copy(CopyFromFolder, CopyToFolder) {
    await fs.promises.mkdir(CopyToFolder, { recursive: true });
    fs.readdir(CopyFromFolder,
        { withFileTypes: true },
        async (err, files) => {
            if (err)
                console.log(err);
            else {
                for (const file of files) {
                    // console.log('try to copy files------->', file.name);
                    if (file.isFile()) {
                        // console.log('try to copy files --->',file.name);
                        await fs.promises.copyFile(path.join(CopyFromFolder, file.name), path.join(CopyToFolder, file.name))
                    } else {
                        await copy(path.join(CopyFromFolder, file.name), path.join(CopyToFolder, file.name))
                    }
                }
                // })
                // console.log('copied folder assets');
            }
        })
}

// copy();

//___________________________________________________________________________________________________

async function createBundle(file) {
    if (file.isFile() && path.parse(file.name).ext.slice(1) === 'css') {
        const readableStream = await fs.promises.readFile(path.join(styleFolder, file.name), 'utf-8');
        await fs.promises.appendFile(path.join(destinationFolder, 'style.css'), readableStream);
    };
};

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
                console.log('Css bundle has been created');
            }
        })
}

// const fs = require('fs');
// const path = require('path');
const searchingFolder = path.join(__dirname, 'components');

async function createHTMLBundle() {
    fs.readdir(searchingFolder,
        { withFileTypes: true },
        async (err, files) => {
            console.log("\nFiles in directory", searchingFolder, ':');
            // let arrayTags = [];
            if (err)
                console.log(err);
            else {
                // const readableStream = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
                // const tagHTML = readableStream;
                // const newHTML = readableStream;

                // files.forEach(async (file) => {
                for (const file of files) {
                    if (file.isFile()) {
                        await writeHTMLTags(path.parse(file.name).name);
                        // const newHTML = readableStream;

                        // (async () => {
                        // const stats = await fs.promises.stat(path.join(searchingFolder, file.name));
                        // const insertComponents = await fs.promises.readFile(path.join(__dirname, 'components', path.parse(file.name).name + '.html'), 'utf-8');
                        // tagHTML = await fs.promises.readFile(path.join(destinationFolder, 'index.html'), 'utf-8');
                        // // tagHTML.replace(`{{${path.parse(file.name).name}}}`, insertComponents);
                        // await fs.promises.writeFile(path.join(destinationFolder, 'index.html'));

                        // await fs.promises.writeFile(path.join(destinationFolder, 'index.html'), newHTML);
                        // return newHTML;
                        // console.log(path.parse(file.name).name, '-', path.parse(file.name).ext.slice(1), '-', stats.size / 1024, 'kb')
                        // arrayTags.push(path.parse(file.name).name);
                        // console.log('arrayTags =====>', arrayTags)
                        // await writeHTMLTags(path.parse(file.name).name);

                        // })().catch(console.error);
                    }
                    // return tagHTML;
                }
                // await fs.promises.writeFile(path.join(destinationFolder, 'index.html'), readableStream);
                // console.log(newHTML);
            }
            // return arrayTags;
        })
}

async function writeHTMLTags(nameComponents) {
    const  readableStream = await fs.promises.readFile(path.join(destinationFolder, 'index.html'), 'utf-8');
    const insertComponents = await fs.promises.readFile(path.join(__dirname, 'components', nameComponents + '.html'), 'utf-8');
    // console.log(`readableStream {{ ${nameComponents} }}`, insertComponents);
    const newHTML = readableStream.replace(`{{${nameComponents}}}`, insertComponents);
    // console.log('==============> newHTML =>', newHTML);
    await fs.promises.writeFile(path.join(destinationFolder, 'index.html'), newHTML);

}

// cssBundleCreate();

(async () => {
    await fs.promises.rm(destinationFolder, { recursive: true, force: true });
    console.log('filesCopyFolder -->', destinationFolder)
    await fs.promises.mkdir(destinationFolder, { recursive: true });
    await fs.promises.mkdir(assetsCopyToFolder, { recursive: true });
    await copy(assetsCopyFromFolder, assetsCopyToFolder);
    await cssBundleCreate();
    await fs.promises.copyFile(path.join(__dirname, 'template.html'), path.join(destinationFolder, 'index.html'));
    await createHTMLBundle();
    // await console.log('------------->tags------------->', tags);
})();