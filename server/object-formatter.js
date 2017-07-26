const moment = require('moment');

const createObj = (data)=> {
	console.log(typeof data, " = ", data);

  var result = {};
  data = data.replace('Data: ', '');

  let now = moment().format();
  let pieces = data.split(/((?:^|&)\w+=)/).filter(Boolean);
  for (var i = 0; i < pieces.length; i += 2) {
    result[pieces[i].replace(/^&|=$/g, '')] = pieces[i + 1].replace(/\+/g, ' ');
  }
  if (result.createdAt === undefined) { result.createdAt = now; }
  result.updatedAt = now;
  result.objectId = now;
  return result;
};

module.exports.createObj = createObj;