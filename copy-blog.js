const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'public', 'blog');
const targetDir = path.join(__dirname, 'dist', 'blog');

// צור את dist/blog אם לא קיים
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// העתק את כל קבצי HTML
fs.readdirSync(sourceDir).forEach(file => {
  if (file.endsWith('.html')) {
    fs.copyFileSync(
      path.join(sourceDir, file),
      path.join(targetDir, file)
    );
    console.log(`✅ Copied: ${file}`);
  }
});
