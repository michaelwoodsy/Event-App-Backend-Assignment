const users = require('../models/users.model');
exports.register = async function(req, res){
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const emailCheck = await users.getEmail(email);

        let checker = 0;

        if((firstName == null || firstName == "") || (lastName == null || lastName == "") || (email == null || !/.+@.+$/.test(email) || emailCheck.length > 0) || (password == null || password == "")){
            checker = 1;
        }

        if (checker == 1) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        }
        else {
            const result = await users.register(firstName, lastName, email, password);
            res.statusMessage = "Created";
            res.status(201).send({userId: result.insertId});
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.login = async function(req, res){
    return null;
};

exports.logout = async function(req, res){
    return null;
};

exports.read = async function(req, res){
    return null;
};

exports.update = async function(req, res){
    return null;
};