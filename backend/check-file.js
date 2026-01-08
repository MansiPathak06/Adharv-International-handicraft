const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'uploads', 'b8af155ea486633cb762f964da830524.png');

console.log('🔍 Checking file:', filePath);
console.log('📁 File exists:', fs.existsSync(filePath));

if (fs.existsSync(filePath)) {
  const stats = fs.statSync(filePath);
  console.log('📊 File size:', stats.size, 'bytes');
  
  const buffer = fs.readFileSync(filePath);
  console.log('🔢 First 20 bytes (hex):', buffer.slice(0, 20).toString('hex'));
  console.log('🔢 First 20 bytes (decimal):', Array.from(buffer.slice(0, 20)));
  
  // Check for common image signatures
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    console.log('✅ Valid PNG file');
  } else if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    console.log('✅ Valid JPEG file (but extension is wrong!)');
  } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    console.log('✅ Valid GIF file');
  } else if (buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP') {
    console.log('✅ Valid WebP file');
  } else {
    console.log('❌ UNKNOWN or CORRUPTED file format');
    console.log('💡 This might not be a valid image file');
  }
}