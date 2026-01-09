const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/functions/metadata.ts');
const content = fs.readFileSync(filePath, 'utf8');

console.log('Testing metadata defaults...');

const expectedTitle = 'The AI Tool Directory';
const expectedDescription = 'Discover, compare, and integrate the best AI tools';
const expectedIcon = '/icons/favicon-32x32.png';

let failed = false;

if (!content.includes(expectedTitle)) {
    console.error(`❌ Title default not updated. Expected to find "${expectedTitle}"`);
    failed = true;
}

if (!content.includes(expectedDescription)) {
    console.error(`❌ Description default not updated. Expected to find "${expectedDescription}"`);
    failed = true;
}

if (!content.includes(expectedIcon)) {
    console.error(`❌ Icon default not updated. Expected to find "${expectedIcon}"`);
    failed = true;
}

if (failed) {
    process.exit(1);
}

console.log('✅ Metadata defaults updated');