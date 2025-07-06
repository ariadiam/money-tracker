const user = require('../models/user.model');

function findAll() {
  const result = user.find();
  return result;
}

 function findOne(username) {
  const result = user.findOne({ username: username });
  return result;
}


module.exports = {
  findAll,
  findOne,
}