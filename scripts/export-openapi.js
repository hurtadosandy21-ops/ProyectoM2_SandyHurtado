const fs = require('fs');
const path = require('path');
const { specs } = require('../src/config/swagger');

const output = path.join(__dirname, '..', 'openapi.json');
fs.writeFileSync(output, JSON.stringify(specs, null, 2) + '\n');
console.log(`✅ Especificación OpenAPI generada en ${output}`);
