const jsonfile = require('jsonfile');
const readline = require('readline');
const fs = require('fs');

objectRet = { results: [] };

const objectRetx = () => {

  let dataArr = [];
  let rl = readline.createInterface({
    input: fs.createReadStream('chatData.json')
  });

  rl.on('line', (line)=> { dataArr.unshift(JSON.parse(line)); });

  var sendResults = ()=> { objectRet = {'results': dataArr } };
  sendResults();
  setTimeout(sendResults, 10);
};

const writeData = (data) => {
  let file = 'chatdata.json';
  let obj = data;
  jsonfile.writeFile(file, obj, {flag: 'a'}, (err)=> {
    // console.error('Error in writeData', err);
  });
};

setInterval(()=> { objectRetx(); }, 500);

module.exports.writeData = writeData;
module.exports.objectRetx = objectRetx;