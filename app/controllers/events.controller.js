const events = require('../models/events.model');

exports.read = async function(req, res){
    try {
        let startIndex = req.params.startIndex;
        let count = req.params.count;
        const q = req.params.q;
        const categoryIds = req.params.categoryIds;
        const organizerId = req.params.organizerId;
        let sortBy = req.params.sortBy;

        if (startIndex == null) {
            startIndex = 0;
        }

        if (sortBy == null) {
            sortBy = 'DATE_DESC';
        }

        if (count == null) {
            const rows = await events.getRows();
            count = rows.length;
        }

        sortBy = await events.sortMapper(sortBy);

        const result = await events.getEvents(startIndex, count, sortBy);

        res.statusMessage = "OK";
        res.status(200).send(result);

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