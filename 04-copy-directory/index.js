const fs = require('fs').promises;
const path = require('path');

async function copyDir(source, destination) {
  try {
    // Ensure the destination directory exists
    await fs.mkdir(destination, { recursive: true });

    // Read the contents of the source directory
    const entries = await fs.readdir(source, { withFileTypes: true });

    // Process each entry in the source directory
    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        // Recursively copy subdirectories
        await copyDir(srcPath, destPath);
      } else {
        // Copy files
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log('Directory copied successfully');
    return true;
  } catch (error) {
    console.error('Error copying directory:', error);
    return false;
  }
}

// Example usage
const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, destDir)
  .then(result => console.log(`Copy operation completed: ${result}`))
  .catch(error => console.error('Copy operation failed:', error));