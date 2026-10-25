const fs = require('fs');
const path = require('path');

const careersPath = path.join(__dirname, '..', 'data', 'careers.json');
const careers = JSON.parse(fs.readFileSync(careersPath, 'utf8'));

let fixedCount = 0;

for (const c of careers) {
  if (typeof c.qualities === 'string') {
    const raw = c.qualities.trim();
    const splitArr = raw.split(/,\s*(?=[A-Z0-9a-z])/).map(s => {
      let trimmed = s.trim().replace(/\.$/, '');
      if (trimmed.length > 0) {
        trimmed = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      }
      return trimmed;
    }).filter(Boolean);

    c.qualities = splitArr.length > 0 ? splitArr : [raw];
    fixedCount++;
  } else if (!c.qualities && c.importantQualities) {
    if (typeof c.importantQualities === 'string') {
      const raw = c.importantQualities.trim();
      const splitArr = raw.split(/,\s*(?=[A-Z0-9a-z])/).map(s => {
        let trimmed = s.trim().replace(/\.$/, '');
        if (trimmed.length > 0) {
          trimmed = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        }
        return trimmed;
      }).filter(Boolean);
      c.qualities = splitArr.length > 0 ? splitArr : [raw];
      fixedCount++;
    } else if (Array.isArray(c.importantQualities)) {
      c.qualities = c.importantQualities;
    }
  }

  // Ensure responsibilities is an array
  if (typeof c.responsibilities === 'string') {
    c.responsibilities = c.responsibilities.split(',').map(s => s.trim()).filter(Boolean);
  }
}

fs.writeFileSync(careersPath, JSON.stringify(careers, null, 2), 'utf8');
console.log(`Successfully fixed qualities format for ${fixedCount} careers in data/careers.json!`);
