const users = require('../models/users.model');
const bcrypt = require("bcrypt");

exports.register = async function(req, res){
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const emailCheck = await users.getEmail(email);

        let checker = 0;

        if((firstName == null || firstName === "") || (lastName == null || lastName === "") || (email == null || !/^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/.test(email) || emailCheck.length > 0) || (password == null || password === "")){
            checker = 1;
        }

        if (checker === 1) {
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
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userCheck = await users.getEmail(email);

        let checker = 0;

        if (userCheck.length === 0) {
            checker = 1;
        }

        if (checker === 1) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        }
        else {
            const emailCheck = userCheck[0].email;
            const passwordCheck = userCheck[0].password;
            const validPassword = await bcrypt.compare(password, passwordCheck);

            if (!validPassword || email !== emailCheck){
                res.statusMessage = "Bad Request";
                res.status(400).send();
            } else {
                const id = userCheck[0].id;
                const token = await users.setToken(id);
                res.statusMessage = "OK";
                res.status(200).send({userId: id, token: token});
                }
            }
        } catch( err ) {
            console.log(err);
            res.statusMessage = "Internal Server Error";
            res.status(500).send();
    }
};

exports.logout = async function(req, res){
    try {
        const token = req.header('X-Authorization');
        const userCheck = await users.findToken(token);

        let checker = 0;

        if (userCheck.length === 0) {
            checker = 1;
        }

        if (checker === 1) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else {
            const id = userCheck[0].id;
            await users.logout(id);
            res.statusMessage = "OK";
            res.status(200).send();
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.read = async function(req, res){
    try {
        const id = req.params.id;
        const userCheck = await users.getUser(id);

        let checker = 0;

        if (userCheck.length === 0) {
            checker = 1;
        }

        if (checker === 1) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            const token = req.header('X-Authorization');
            if (userCheck[0].auth_token === token) {
                const result = {firstName: userCheck[0].first_name, lastName: userCheck[0].last_name, email: userCheck[0].email};
                res.statusMessage = "OK";
                res.status(200).send(result);
            } else {
                const result = {firstName: userCheck[0].first_name, lastName: userCheck[0].last_name};
                res.statusMessage = "OK";
                res.status(200).send(result);
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.update = async function(req, res){
    try {
        const id = req.params.id;
        const userCheck = await users.getUser(id);
        const token = req.header('X-Authorization');
            if (userCheck.length === 0) {
                res.statusMessage = "Not Found";
                res.status(404).send();
            } else if (token == null) {
                res.statusMessage = "Unauthorized";
                res.status(401).send();
            } else if (token !== userCheck[0].auth_token) {
                res.statusMessage = "Forbidden";
                res.status(403).send();
            } else {
                res.statusMessage = "Forbidden";
                res.status(403).send();
                const firstName = req.body.firstName;
                const lastName = req.body.lastName;
                const email = req.body.email;
                const currentPassword = req.body.currentPassword;
                const password = req.body.password;

                let checker = 0;

                if (password != null && currentPassword != null) {
                    if (password === "" || currentPassword === "") {
                        res.statusMessage = "Bad Request";
                        res.status(400).send();
                        checker = 1;
                    } else{
                        const validPassword = await bcrypt.compare(currentPassword, userCheck[0].password);
                        if (!validPassword) {
                            res.statusMessage = "Forbidden";
                            res.status(403).send();
                            checker = 1;
                        } else {
                            await users.setPassword(id, password);
                        }
                    }
                }

                if (firstName != null) {
                    if (firstName === "") {
                        res.statusMessage = "Bad Request";
                        res.status(400).send();
                        checker = 1;
                    } else {
                        await users.setFirstName(id,firstName);
                    }
                }

                if (lastName != null) {
                    if (lastName === "") {
                        res.statusMessage = "Bad Request";
                        res.status(400).send();
                        checker = 1;
                    } else {
                        await users.setLastName(id, lastName);
                    }
                }

                if (email != null) {
                    if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/.test(email)) {
                        res.statusMessage = "Bad Request";
                        res.status(400).send();
                        checker = 1;
                    } else {
                        const emailCheck = await users.getEmail(email);
                        if (emailCheck.length > 0) {
                            res.statusMessage = "Bad Request";
                            res.status(400).send();
                            checker = 1;
                        } else {
                            await users.setEmail(id, email);
                        }
                    }
                }

                if (checker === 0) {
                    res.statusMessage = "OK";
                    res.status(200).send();
                } else {
                    res.statusMessage = "Bad Request";
                    res.status(400).send();
                }
            }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};