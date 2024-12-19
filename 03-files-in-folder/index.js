const fileFolder = '03-files-in-folder/secret-folder/';
const fs = require('fs');
const path = require('path');

function getFileInfo(filePath) {
  const stats = fs.statSync(filePath);
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName).slice(1); // Remove leading dot
  return `${path.basename(fileName, `.${extension}`)}-${extension}-${
    stats.size
  }`;
}

function displayFileInformation(directoryPath) {
  try {
    fs.readdirSync(directoryPath, { withFileTypes: true }).forEach((entry) => {
      if (
        !entry.name.startsWith('.') &&
        entry.isFile() &&
        !entry.isDirectory()
      ) {
        const fileInfo = getFileInfo(path.join(directoryPath, entry.name));
        console.log(fileInfo);
      }
    });
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

displayFileInformation(fileFolder);
