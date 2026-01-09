const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

console.log('Testing package.json metadata...');

try {
  assert.strictEqual(packageJson.name, 'luro-ai', 'Name should be luro-ai');
  assert.strictEqual(packageJson.description, 'The AI Tool Directory', 'Description should be set');
  console.log('✅ Metadata tests passed');
} catch (e) {
  console.error('❌ Metadata tests failed:', e.message);
  process.exit(1);
}
