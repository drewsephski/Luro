const fs = require('fs');
const path = require('path');

const requiredAssets = [
    'public/icons/favicon-16x16.png',
    'public/icons/favicon-32x32.png',
    'public/icons/icon.png',
    'public/icons/logo.png',
    'public/icons/logo-dark.png'
];

let failed = false;

console.log('Testing asset existence...');

requiredAssets.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing asset: ${file}`);
        failed = true;
    } else {
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
             console.error(`❌ Empty asset: ${file}`);
             failed = true;
        }
    }
});

if (failed) {
    process.exit(1);
}

console.log('✅ All assets present');
