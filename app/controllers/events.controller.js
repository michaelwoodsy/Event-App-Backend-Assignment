const events = require('../models/events.model');

exports.read = async function(req, res){
    try {
        let startIndex = req.query.startIndex;
        let count = req.query.count;
        const q = req.query.q;
        const categoryIds = req.query.categoryIds;
        const organizerId = req.query.organizerId;
        let sortBy = req.query.sortBy;

        if (startIndex == null) {
            startIndex = 0;
        }

        if (sortBy == null) {
            sortBy = 'DATE_DESC';
        }

        sortBy = await events.sortMapper(sortBy);
        let result = [];
        result = await events.getEvents(sortBy);

        if (count == null) {
            res.statusMessage = "OK";
            res.status(200).send(result.slice(startIndex));
        } else {
            count = Number(count) + 1;
            res.statusMessage = "OK";
            res.status(200).send(result.slice(startIndex, count));
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