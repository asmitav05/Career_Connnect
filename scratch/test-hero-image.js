const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('=== STARTING HERO IMAGE VERIFICATION TEST ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: buffer.toString('utf8'),
          raw: buffer
        });
      });
    }).on('error', reject);
  });
}

(async () => {
  try {
    // 1. Check index.html markup
    const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    assert(indexHtml.includes('class="hero-image-container"'), 'index.html contains .hero-image-container');
    assert(indexHtml.includes('class="hero-image"'), 'index.html contains .hero-image');
    assert(
      indexHtml.includes('alt="Illustration of career exploration, education pathways, and scholarships"'),
      'index.html contains exact required gender-neutral alt text'
    );
    assert(indexHtml.includes('src="images/career-hero.png"'), 'index.html points to images/career-hero.png');
    assert(indexHtml.includes('images/hero-illustration.svg'), 'index.html includes SVG fallback');

    // 2. Check local disk assets
    const pngPath = path.join(__dirname, '..', 'images', 'career-hero.png');
    const svgPath = path.join(__dirname, '..', 'images', 'hero-illustration.svg');

    assert(fs.existsSync(pngPath), 'images/career-hero.png exists on disk');
    const pngStats = fs.statSync(pngPath);
    assert(pngStats.size > 100000, `career-hero.png is rich, high-resolution image (${pngStats.size} bytes)`);

    assert(fs.existsSync(svgPath), 'images/hero-illustration.svg exists on disk');
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    assert(!svgContent.includes('Local & Private'), 'Bare ampersand on line 130 is fixed with &amp;');

    // 3. Check CSS styling & responsiveness
    const cssContent = fs.readFileSync(path.join(__dirname, '..', 'css', 'main.css'), 'utf8');
    assert(cssContent.includes('.hero-image-container'), 'css/main.css defines .hero-image-container');
    assert(cssContent.includes('.hero-image'), 'css/main.css defines .hero-image');
    assert(cssContent.includes('max-width: 540px'), 'css/main.css constrains image max-width');
    assert(cssContent.includes('object-fit: contain'), 'css/main.css applies object-fit: contain');

    // 4. Live Server HTTP Requests
    const pngRes = await fetch('http://127.0.0.1:3000/images/career-hero.png');
    assert(pngRes.status === 200, 'HTTP GET /images/career-hero.png returns 200 OK');
    assert(pngRes.headers['content-type'] === 'image/png', 'Content-Type is image/png');
    assert(pngRes.raw.length === pngStats.size, `Served exact byte length: ${pngRes.raw.length}`);

    const svgRes = await fetch('http://127.0.0.1:3000/images/hero-illustration.svg');
    assert(svgRes.status === 200, 'HTTP GET /images/hero-illustration.svg returns 200 OK');
    assert(svgRes.headers['content-type'].includes('svg'), 'Content-Type is image/svg+xml');

    const homeRes = await fetch('http://127.0.0.1:3000/index.html');
    assert(homeRes.status === 200, 'HTTP GET /index.html returns 200 OK');
    assert(homeRes.body.includes('images/career-hero.png'), 'Live homepage serves updated image src');

    console.log(`\n=== HERO IMAGE TEST SUMMARY ===`);
    console.log(`Results: ${passed} / ${passed + failed} passed (${Math.round((passed / (passed + failed)) * 100)}%)\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
})();
