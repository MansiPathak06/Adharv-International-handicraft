const fs = require('fs');
const path = require('path');

// Function to detect actual image type by reading file header
function getActualImageType(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check PNG signature (89 50 4E 47)
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return '.png';
    }
    
    // Check JPEG signature (FF D8 FF)
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return '.jpg';
    }
    
    // Check GIF signature (47 49 46)
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return '.gif';
    }
    
    // Check WebP signature (52 49 46 46 ... 57 45 42 50)
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
      if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return '.webp';
      }
    }
    
    return null; // Unknown format
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return null;
  }
}

const uploadsDir = path.join(__dirname, 'uploads');

console.log('🔍 Detecting and fixing image extensions...\n');

fs.readdir(uploadsDir, (err, files) => {
  if (err) {
    console.error('❌ Error reading uploads directory:', err);
    return;
  }

  let fixed = 0;
  let alreadyCorrect = 0;
  let errors = 0;

  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const currentExt = path.extname(file).toLowerCase();
    
    // Detect actual image type
    const actualExt = getActualImageType(filePath);
    
    if (!actualExt) {
      console.log(`⚠️  Unknown format: ${file}`);
      errors++;
      return;
    }
    
    // If extension matches actual format, skip
    if (currentExt === actualExt) {
      console.log(`✅ Correct: ${file}`);
      alreadyCorrect++;
      return;
    }
    
    // Rename to correct extension
    const baseName = path.basename(file, currentExt);
    const newFileName = baseName + actualExt;
    const newPath = path.join(uploadsDir, newFileName);
    
    fs.rename(filePath, newPath, (err) => {
      if (err) {
        console.error(`❌ Error renaming ${file}:`, err);
        errors++;
      } else {
        console.log(`🔧 Fixed: ${file} → ${newFileName} (was ${currentExt}, actually ${actualExt})`);
        fixed++;
      }
    });
  });

  setTimeout(() => {
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Already correct: ${alreadyCorrect}`);
    console.log(`   🔧 Fixed: ${fixed}`);
    console.log(`   ⚠️  Errors: ${errors}`);
  }, 1000);
});