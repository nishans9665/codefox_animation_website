import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'src', 'assets');

const files = fs.readdirSync(assetsDir);

async function optimizeImages() {
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      
      // If file is larger than 200KB, optimize it
      if (stats.size > 200 * 1024) {
        console.log(`Optimizing ${file}... (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        const webpPath = path.join(assetsDir, file.replace(ext, '.webp'));
        
        await sharp(filePath)
          .resize({ width: 1920, withoutEnlargement: true }) // Max width 1920
          .webp({ quality: 80 })
          .toFile(webpPath);
          
        console.log(`Created ${path.basename(webpPath)}`);
      }
    }
  }
}

optimizeImages().catch(console.error);
