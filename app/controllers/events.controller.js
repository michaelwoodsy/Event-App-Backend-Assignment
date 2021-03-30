const events = require('../models/events.model');

exports.read = async function(req, res){
    try {
        let startIndex = req.query.startIndex;
        let count = req.query.count;
        let q = req.query.q;
        let categoryIds = req.query.categoryIds;
        let organizerId = req.query.organizerId;
        let sortBy = req.query.sortBy;

        if (startIndex == null) {
            startIndex = 0;
        }

        if (sortBy == null) {
            sortBy = 'DATE_DESC';
        }

        if (q == null) {
            q = '';
        }

        if (organizerId == null) {
            organizerId = '';
        }

        const cats = await events.getCategories();

        let confirm = 0;
        if (categoryIds != null) {
            for (let i = 0; i < categoryIds.length; i++) {
                let checker = 0;
                for (let j = 0; j < cats.length; j++) {
                    if (categoryIds[i] == cats[j].id) {
                        checker = 1;
                    }
                }
                if (checker == 0) {
                    confirm = 1;
                }
            }
        }

        if (confirm == 1) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
            q ='%' + q + '%';
            organizerId ='%' + organizerId + '%';
            sortBy = await events.sortMapper(sortBy);

            let result = [];
            result = await events.getEvents(sortBy, q, organizerId);

            if (count == null) {
                res.statusMessage = "OK";
                res.status(200).send(result.slice(startIndex));
            } else {
                count = Number(count) + 1;
                res.statusMessage = "OK";
                res.status(200).send(result.slice(startIndex, count));
            }
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