const bcrypt = require('bcryptjs');

function hash(password) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

module.exports = { hash };
