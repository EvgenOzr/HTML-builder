const fs = require('fs');
const anotherFs = require('fs').promises;
const path = require('path');
const glob = require('glob');

const Error = (err) => {
    if (err) {
        return console.error(err);
    }
};

function createHtml(name){

    let modifiedHtml = new Promise((resolve) => {
        fs.readFile(path.join(__dirname, name),'utf8', (err, data) => resolve(data))
    })
    modifiedHtml.then((data) => {
        const components = glob.sync(path.join(path.join(__dirname, 'components'), '*.html'));
        components.forEach((component) => {
            const componentName = path.basename(component, '.html');
            data = data.replace(
            new RegExp(`{{${componentName}}}`, 'g'),
            fs.readFileSync(component, 'utf8'),
            );
        });
        return data
    }).then((content) => fs.writeFile( path.join(__dirname, 'project-dist', 'index.html'), content, Error))
}

function compileCss(folderPath, outputFilePath) {
    return new Promise((resolve, reject) => {
        glob(path.join(folderPath, '**/*.css'), (err, files) => {
        if (err) {
            reject(err);
            return;
        }

        let cssContent = '';

        files.forEach(file => {
            try {
            const fileContent = fs.readFileSync(file, 'utf8');
            cssContent += fileContent + '\n\n';
            } catch (error) {
            console.error(`Error reading file ${file}:`, error);
            }
        });

        fs.writeFile(outputFilePath, cssContent, (err) => {
            if (err) {
            reject(err);
            } else {
            resolve();
            }
        });
        });
    });
}

async function copyAssets(source, destination) {
    try {
      // Ensure the destination directory exists
      await anotherFs.mkdir(destination, { recursive: true });
  
      // Read the contents of the source directory
      const entries = await anotherFs.readdir(source, { withFileTypes: true });
  
      // Process each entry in the source directory
      for (const entry of entries) {
        const srcPath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);
  
        if (entry.isDirectory()) {
          // Recursively copy subdirectories
          await copyAssets(srcPath, destPath);
        } else {
          // Copy files
          await anotherFs.copyFile(srcPath, destPath);
        }
      }
  
      return true;
    } catch (error) {
      console.error('Error copying directory:', error);
      return false;
    }
  }

function processProject() {
    // create dir
    fs.mkdir(path.join(__dirname, 'project-dist'),{ recursive: true },Error);
    // create index.html
    createHtml('template.html')
    // create style.css
    compileCss(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist/style.css'))
    // copy assets
    copyAssets(path.join(__dirname, 'assets'),path.join(__dirname,'project-dist/assets'))
        .then(result => console.log(`Copy operation completed: ${result}`))
        .catch(error => console.error('Copy operation failed:', error));
}

processProject();

