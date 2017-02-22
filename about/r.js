const fs = require('fs');
const path = require('path');

const mdFiles = [];

const addMdFilesToArr = (folder) => {
  fs.readdirSync(folder).forEach(f => {
    let filePath = path.join(folder, f);
    let tmpF = fs.statSync(filePath);
    if (tmpF.isDirectory()) {
      addMdFilesToArr(filePath);
    }
    else if (path.extname(f) === '.md') {
      mdFiles.push(filePath);
    }
  });
}

addMdFilesToArr(__dirname);

let processCount = 0;

mdFiles.forEach(file => {
  let name = path.basename(file);
  let content = fs.readFileSync(file, 'utf8');
  let date = new Date();
  if (name.indexOf('[') === 0) {
    date = name.match(/\[\d{8}\]/)[0];
    date = new Date(+date.substr(1, 4), date.substr(5, 2) - 1, date.substr(7, 2));
  }
  let dateStr = date.toLocaleString().replace(/-/g, '/');
  name = name.replace(/\[\d{8}\]/g, '').replace('.md', '');
  let needProcess = true;
  if (content.indexOf('---') === 0) {
    needProcess = false;
  }
  if (needProcess) {
    fs.writeFileSync(file, `---\ntitle: ${name}\ndate: ${dateStr}\n---\n\n${content}`, 'utf8');
    processCount++;
  }
});

console.log(mdFiles.length, 'ok', processCount);