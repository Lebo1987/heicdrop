// copy-blog.js
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "public", "blog");
const destDir = path.join(__dirname, "dist", "blog");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const normalizeFileName = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-\.]/g, "");

fs.readdirSync(srcDir).forEach((file) => {
  const srcFile = path.join(srcDir, file);
  const cleanName = normalizeFileName(file);
  const destFile = path.join(destDir, cleanName);
  fs.copyFileSync(srcFile, destFile);
  console.log(`✅ Copied & renamed: ${file} -> ${cleanName}`);
});

