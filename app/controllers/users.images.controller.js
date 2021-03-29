const usersImages = require('../models/users.images.model');
const fs = require("fs");

exports.read = async function(req, res){
    try {
        const id = req.params.id
        const imageCheck = await usersImages.getUser(id);
        if (imageCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            const image = imageCheck[0].image_filename;
            if (image == null) {
                res.statusMessage = "Not Found";
                res.status(404).send();
            } else {
                if (image.endsWith("png")) {
                    res.header("Content-Type").set('image/png')
                    res.statusMessage = "OK";
                    res.status(200).sendFile(image, {root: "storage/images"});
                } else if (image.endsWith("jpg")) {
                    res.header("Content-Type").set('image/jpeg')
                    res.statusMessage = "OK";
                    res.status(200).sendFile(image, {root: "storage/images"});
                } else if (image.endsWith("gif")) {
                    res.header("Content-Type").set('image/gif')
                    res.statusMessage = "OK";
                    res.status(200).sendFile(image, {root: "storage/images"});
                }
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.set = async function(req, res){
    try {
        const id = req.params.id
        const imageCheck = await usersImages.getUser(id);
        const token = req.header('X-Authorization');

        if (imageCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (token == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (token !== imageCheck[0].auth_token) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            const type = req.header("Content-Type");
            const date = Date.now();
            let image_filename = 'user_' + date;
            const savePath = 'storage/images/';

            if (type === 'image/png') {
                image_filename += '.png';
            } else if (type === 'image/jpeg') {
                image_filename += '.jpg';
            } else if (type === 'image/gif') {
                image_filename += '.gif';
            }

            const filename = savePath + image_filename;
            const imageBody = req.body;

            if (imageCheck[0].image_filename == null) {
                res.statusMessage = "Created";
                await usersImages.set(id, image_filename);
                await fs.writeFile(filename, imageBody);
                res.status(201).send();
            } else {
                res.statusMessage = "OK";
                await usersImages.set(id, image_filename);
                await fs.writeFile(filename, imageBody);
                res.status(200).send();
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.delete = async function(req, res){
    try {
        const id = req.params.id
        const imageCheck = await usersImages.getUser(id);
        const token = req.header('X-Authorization');

        if (imageCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (token == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (token !== imageCheck[0].auth_token) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            await usersImages.delete(id);
            res.statusMessage = "OK";
            res.status(200).send();
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};