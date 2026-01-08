const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

console.log('🔍 Scanning uploads folder...\n');

fs.readdir(uploadsDir, (err, files) => {
  if (err) {
    console.error('❌ Error reading uploads directory:', err);
    return;
  }

  let renamed = 0;
  let skipped = 0;

  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    
    // Skip if already has extension
    if (path.extname(file)) {
      console.log(`⏭️  Skipping ${file} - already has extension`);
      skipped++;
      return;
    }

    // ✅ CHANGED: Add .png extension instead of .jpg
    const newPath = filePath + '.png';
    
    fs.rename(filePath, newPath, (err) => {
      if (err) {
        console.error(`❌ Error renaming ${file}:`, err);
      } else {
        console.log(`✅ Renamed: ${file} → ${file}.png`);
        renamed++;
      }
    });
  });

  setTimeout(() => {
    console.log(`\n📊 Summary: ${renamed} files renamed, ${skipped} files skipped`);
  }, 1000);
});