const bcrypt = require("bcrypt");

exports.hash = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}