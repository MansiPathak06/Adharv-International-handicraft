const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

console.log('🔍 Converting .jpg to .png...\n');

fs.readdir(uploadsDir, (err, files) => {
  if (err) {
    console.error('❌ Error reading uploads directory:', err);
    return;
  }

  let renamed = 0;

  files.forEach(file => {
    // Only process .jpg files
    if (!file.endsWith('.jpg')) {
      return;
    }

    const oldPath = path.join(uploadsDir, file);
    const newFileName = file.replace('.jpg', '.png');
    const newPath = path.join(uploadsDir, newFileName);
    
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(`❌ Error renaming ${file}:`, err);
      } else {
        console.log(`✅ Renamed: ${file} → ${newFileName}`);
        renamed++;
      }
    });
  });

  setTimeout(() => {
    console.log(`\n📊 Summary: ${renamed} files converted from .jpg to .png`);
  }, 1000);
});