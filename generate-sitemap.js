// generate-sitemap.js
const fs = require("fs");
const path = require("path");

const blogDir = path.join(__dirname, "public", "blog");
const outputPath = path.join(__dirname, "public", "sitemap.xml");

const baseUrl = "https://heicdrop.com";
const blogBase = `${baseUrl}/blog`;

function getBlogLinks() {
  if (!fs.existsSync(blogDir)) return [];

  return fs.readdirSync(blogDir)
    .filter(f => f.endsWith(".html"))
    .map(file => ({
      loc: `${blogBase}/${file}`,
      lastmod: new Date().toISOString().split("T")[0]
    }));
}

const staticRoutes = [
  { loc: `${baseUrl}/`, priority: "1.0" }
];

const blogRoutes = getBlogLinks();

const allUrls = [...staticRoutes, ...blogRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    <priority>${url.priority || "0.8"}</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(outputPath, xml);
console.log("✅ Sitemap generated with", allUrls.length, "URLs");
