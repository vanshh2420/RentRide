import fs from 'fs';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  
  // Keep first line and last line with backtick, replace backticks in all other lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i < 15 || i > lines.length - 5) {
      newLines.push(line);
      continue;
    }
    
    // In middle lines, replace pairs of backticks with <code>...</code>
    // e.g. `foo` -> <code>foo</code>
    let newLine = line;
    let parts = newLine.split('`');
    if (parts.length > 1) {
      let reconstructed = parts[0];
      for (let p = 1; p < parts.length; p++) {
        if (p % 2 === 1) {
          reconstructed += '<code>' + parts[p];
        } else {
          reconstructed += '</code>' + parts[p];
        }
      }
      newLine = reconstructed;
    }
    newLines.push(newLine);
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  console.log(`Cleaned ${filePath}`);
}

fixFile('server/src/scripts/synopsisContent.js');
fixFile('server/src/scripts/srsContent.js');
