const bcrypt = require("bcrypt");

async function hash(password) {
  return bcrypt.hash(password, 10);
}

async function compare(password, hashedpassword) {
  return bcrypt.compare(password, hashedpassword);
}

module.exports = {
  hash,
  compare,
};
