import fs from 'fs';
import path from 'path';

// Directories to check
const dirs = [
  'media',
  'public/media',
  'public',
  '.next/server/media',
  '.next/static/media'
];



// Check each directory
for (const dir of dirs) {
  try {
    const dirPath = path.resolve(process.cwd(), dir);

    
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);

      
      // List up to 5 files as samples
      const sampleFiles = files.slice(0, 5);
      if (sampleFiles.length > 0) {
        console.log('Sample files:');
        sampleFiles.forEach(file => {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);
          const size = (stats.size / 1024).toFixed(2) + ' KB';
          console.log(`  - ${file} (${size})`);
        });
        
        if (files.length > 5) {
          console.log(`  ...and ${files.length - 5} more`);
        }
      }
    } else {
      console.log('❌ Directory does not exist');
    }
  } catch (error) {
    console.error(`Error checking ${dir}:`, error);
  }
  console.log('---');
}

console.log('\n=== CHECKING NEXTJS CONFIGURATION ===');
try {
  const nextConfigPath = path.resolve(process.cwd(), 'next.config.ts');
  if (fs.existsSync(nextConfigPath)) {
    const configContent = fs.readFileSync(nextConfigPath, 'utf-8');
    console.log('Found next.config.ts');
    
    // Check for image configuration
    if (configContent.includes('images:')) {
      console.log('✅ Has image configuration');
    } else {
      console.log('❌ Missing image configuration');
    }
    
    // Check for static file serving configuration
    if (configContent.includes('rewrites()')) {
      console.log('✅ Has URL rewrite configuration');
    } else {
      console.log('❌ No URL rewrite configuration');
    }
  } else {
    console.log('❌ next.config.ts not found');
  }
} catch (error) {
  console.error('Error checking Next.js config:', error);
}

console.log('=== MEDIA CHECK COMPLETE ===');
