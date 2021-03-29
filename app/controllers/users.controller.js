const users = require('../models/users.model');
const bcrypt = require("bcrypt");

exports.register = async function (req, res) {
    const email = req.body.email
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const password = req.body.password

    if (email == null || firstName == null || lastName == null || password == null || firstName === "" || lastName === "" || password === "") {
        res.statusMessage = "Bad Request";
        res.status(400).send();

    } else if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/.test(email)) {
        res.statusMessage = "Bad Request";
        res.status(400).send();

    } else {
        try {
            const emailCheck = await users.getEmail(email);
            if (emailCheck.length !== 0)  {
                res.statusMessage = "Bad Request";
                res.status(400).send();
            } else {
                const result = await users.register(email, firstName, lastName, password);
                res.statusMessage = "OK";
                res.status(201).send({userId: result.insertId});
            }
        } catch( err ) {
            res.status( 500 )
                .send( `ERROR inserting users ${ err }` );
        }
    }
};

exports.login = async function(req, res){
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (email == null || password == null) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
            const emailCheck = await users.getEmail(email);

            let checker = 0;

            if (emailCheck.length === 0) {
                checker = 1;
            }

            if (checker === 1) {
                res.statusMessage = "Bad Request";
                res.status(400).send();
            }
            else {
                const passwordCheck = emailCheck[0].password;
                const validPassword = await bcrypt.compare(password, passwordCheck);

                if (!validPassword){
                    res.statusMessage = "Bad Request";
                    res.status(400).send();
                } else {
                    const id = emailCheck[0].id;
                    const token = await users.setToken(id);
                    res.statusMessage = "OK";
                    res.status(200).send({userId: id, token: token});
                }
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.logout = async function (req, res) {
    try {
        const authToken = req.header('X-Authorization');
        const tokenCheck = await users.findToken(authToken);

        if (tokenCheck.length === 0) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else {
            await users.logout(tokenCheck[0].id);
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
        console.log(id);
        const userCheck = await users.getUser(id);
        console.log(userCheck);
        const token = req.header('X-Authorization');
        console.log(token);
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
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;
            const currentPassword = req.body.currentPassword;
            const password = req.body.password;

            let checker = 0;

            if (password != null) {
                if (password === "") {
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

            if (firstName != null) {
                if (firstName === "") {
                    res.statusMessage = "Bad Request";
                    res.status(400).send();
                    checker = 1;
                } else {
                    await users.setFirstName(id, firstName);
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
