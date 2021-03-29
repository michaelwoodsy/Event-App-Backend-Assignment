const events = require('../models/events.model');
exports.read = async function(req, res){
    try {
        const result = await events.read();
        if( result.length === 0 ){
            res.statusMessage = "Bad Request";
            res.status(400).send();
        }
        else {
            res.statusMessage = "OK";
            res.status(200).send(result);
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.create = async function(req, res){
    return null;
};

exports.readEvent = async function(req, res){
    return null;
};

exports.update = async function(req, res){
    return null;
};

exports.delete = async function(req, res){
    return null;
};

exports.categories = async function(req, res){
    return null;
};