const fs = require("fs");
const path = require("path");

const tempDir = path.resolve(__dirname, "..", ".tmp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

process.env.TEMP = tempDir;
process.env.TMP = tempDir;

module.exports = tempDir;
