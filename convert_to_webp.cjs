const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'public');
const srcDir = path.join(__dirname, 'src');
const indexHtml = path.join(__dirname, 'index.html');

async function processImages(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            await processImages(filePath);
        } else if (/\.(png|jpg|jpeg)$/i.test(filePath)) {
            const ext = path.extname(filePath);
            const webpPath = filePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
            try {
                await sharp(filePath)
                    .webp({ quality: 80, effort: 6 })
                    .toFile(webpPath);
                fs.unlinkSync(filePath);
                console.log(`Converted: ${filePath} -> ${webpPath}`);
            } catch (err) {
                console.error(`Error converting ${filePath}:`, err);
            }
        }
    }
}

function updateReferences(dir) {
    if (!fs.existsSync(dir)) return;
    const stat = fs.statSync(dir);
    if (stat.isFile()) {
        if (/\.(jsx|js|css|html)$/i.test(dir)) {
            let content = fs.readFileSync(dir, 'utf8');
            let newContent = content.replace(/\.png/gi, '.webp')
                                    .replace(/\.jpg/gi, '.webp')
                                    .replace(/\.jpeg/gi, '.webp');
            if (content !== newContent) {
                fs.writeFileSync(dir, newContent, 'utf8');
                console.log(`Updated references in: ${dir}`);
            }
        }
    } else if (stat.isDirectory()) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            updateReferences(path.join(dir, file));
        }
    }
}

async function run() {
    console.log('Starting image conversion...');
    await processImages(publicDir);
    console.log('Image conversion complete.');
    
    console.log('Updating references...');
    updateReferences(srcDir);
    updateReferences(indexHtml);
    console.log('Reference update complete.');
}

run();
