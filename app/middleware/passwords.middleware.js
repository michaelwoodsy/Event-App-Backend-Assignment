const bcrypt = require("bcrypt");

exports.hash = function (password) {
    const hash = bcrypt.hash(password, 10);
    return hash;
}