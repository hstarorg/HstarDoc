const fs = require('fs');
const path = require('path');

const replaceRegExp = /<!--TableOfContnets Start-->(\r\n|\n|.|\.)*<!--TableOfContnets End-->/;

const getSpaces = level => {
  let result = '';
  for (let i = 0; i < level; i++) {
    result += '    ';
  }
  return result;
};

const getSafePath = p => {
  let v = p.replace(/\\/g, '/');
  return encodeURI(v);
};

let tableOfContnets = '';

const processDir = (folder, level = 0) => {
  let dirs = fs.readdirSync(folder);
  dirs.forEach(folderName => {
    if (folderName.startsWith('.')) {
      return;
    }
    let folderPath = path.join(folder, folderName);
    if (fs.statSync(folderPath).isDirectory()) {
      tableOfContnets += `${getSpaces(level)}* [${folderName}](${getSafePath(folderPath)})\n`;
      processDir(folderPath, level + 1);
    } else if (path.extname(folderPath) === '.md') {
      tableOfContnets += `${getSpaces(level)}* [${folderName}](${getSafePath(folderPath)})\n`;
    }
  });
};

processDir('.');

let readmeContent = fs.readFileSync('README.md', 'utf8');

let newReadmeContent = readmeContent.replace(replaceRegExp, `<!--TableOfContnets Start-->\n${tableOfContnets}<!--TableOfContnets End-->\n\n`)
fs.writeFileSync('README.md', newReadmeContent, 'utf8');

console.log('更新目录成功！');