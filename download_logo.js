import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUrl = '../src/assets/CodeFoxIT-Web-LOGO.png';
const publicDir = path.resolve(__dirname, 'public');
const logoPath = path.resolve(publicDir, 'logo.png');

async function downloadImage() {
    try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(logoPath, Buffer.from(buffer));
        console.log('Logo downloaded successfully to', logoPath);
    } catch (error) {
        console.error('Error downloading logo:', error);
    }
}

downloadImage();
