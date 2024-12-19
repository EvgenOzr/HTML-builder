const fs = require('fs');
const path = require('path');
const glob = require('glob');

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

const stylesFolder = path.join(__dirname, 'styles');
const outputFilePath = path.join(__dirname, 'bundle.css');

compileCss(stylesFolder, outputFilePath)
  .then(() => console.log('CSS compilation complete'))
  .catch(error => console.error('Error during CSS compilation:', error));
