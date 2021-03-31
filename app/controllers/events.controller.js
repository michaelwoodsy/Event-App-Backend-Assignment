const events = require('../models/events.model');
const users = require('../models/users.model');

//fix organizerId, like is scuffed and it will bug out
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

        let categoryCheck = true;

        if (categoryIds != null) {
            if (Array.isArray(categoryIds)) {
                for (let i = 0; i < categoryIds.length; i++) {
                    let checkCategory = await events.checkCategory(categoryIds[i]);
                    if (checkCategory.length === 0) {
                        categoryCheck = false;
                    }
                }
            } else {
                let checkCategory = await events.checkCategory(categoryIds);
                if (checkCategory.length === 0) {
                    categoryCheck = false;
                }
            }
        }
        if (!categoryCheck) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
        } else {
            q ='%' + q + '%';
            organizerId ='%' + organizerId + '%';
            sortBy = await events.sortMapper(sortBy);

            let result = [];
            if (organizerId === '%%') {
                result = await events.getEvents(sortBy, q, organizerId);
            } else {
                organizerId = organizerId.replace('%','');
                result = await events.getEventsOrganizer(sortBy, q, organizerId);
            }

            if (categoryIds == null) {
                if (count == null) {
                    res.statusMessage = "OK";
                    res.status(200).send(result.slice(startIndex));
                } else {
                    count = Number(count) + 1;
                    res.statusMessage = "OK";
                    res.status(200).send(result.slice(startIndex, count));
                }
            } else {
                let rows = [];
                for (let i = 0; i < result.length; i++) {
                    let checker = false;
                    for (let j = 0; j < categoryIds.length; j++) {
                        let numberCheck = Number(categoryIds[j])
                        if (result[i].categories.includes(numberCheck)) {
                            checker = true;
                        }
                    }
                    if (checker) {
                        rows.push(result[i]);
                    }
                }

                if (count == null) {
                    res.statusMessage = "OK";
                    res.status(200).send(rows.slice(startIndex));
                } else {
                    count = Number(count) + 1;
                    res.statusMessage = "OK";
                    res.status(200).send(rows.slice(startIndex, count));
                }

            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.create = async function(req, res){
    try{
        const title = req.body.title;
        const description = req.body.description;
        const categoryIds = req.body.categoryIds;
        const date = req.body.date;
        let isOnline = req.body.isOnline;
        const url = req.body.url;
        const venue = req.body.venue;
        const capacity = req.body.capacity;
        let requiresAttendanceControl = req.body.requiresAttendanceControl;
        let fee = req.body.fee;
        const authToken = req.header('X-Authorization');
        const user = await users.findToken(authToken);

        if (fee == null) {
            fee = 0.00
        }

        if (isOnline == null) {
            isOnline = 0;
        }

        if (requiresAttendanceControl == null) {
            requiresAttendanceControl = 0;
        }

        if (user.length === 0) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else {
            if ((title == null && title !== "") || description == null || categoryIds == null || date == null) {
                res.statusMessage = "Bad Request";
                res.status(400).send();
            }
            let categoryCheck = true;
            for (let i = 0; i < categoryIds.length; i++) {
                let checkCategory = await events.checkCategory(categoryIds[i]);
                if (checkCategory.length === 0) {
                    categoryCheck = false;
                }
            }
            if (!categoryCheck) {
                res.statusMessage = "Bad Request";
                res.status(400).send();
            } else {
                const currentDate = new Date();
                const dateObject = new Date(req.body.date);
                if (dateObject < currentDate) {
                    res.statusMessage = "Bad Request";
                    res.status(400).send();
                } else {
                    const eventCheck = await events.checkEvent(title, date, user[0].id);
                    if (eventCheck.length !== 0) {
                        res.statusMessage = "Bad Request";
                        res.status(400).send();
                    } else {
                        const event = await events.getId();
                        const id = event[0].minusID + 1;
                        await events.addEvent(title, description, date, isOnline, url, venue, capacity, requiresAttendanceControl, fee, user[0].id);
                        for (let i = 0; i < categoryIds.length; i++) {
                            await events.addEventCategory(id, categoryIds[i])
                        }
                        res.statusMessage = "OK";
                        res.status(200).send({eventID: String(id)});
                    }
                }
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.readEvent = async function(req, res){
    try{
        const id = req.params.id;
        const eventCheck = await events.getEvent(id);

        if (eventCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            res.statusMessage = "OK";
            res.status(200).send(eventCheck);
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.update = async function(req, res){
    return null;
};

exports.delete = async function(req, res){
    try{
        const id = req.params.id;
        const eventCheck = await events.getEvent(id);

        const authToken = req.header('X-Authorization');
        const user = await users.findToken(authToken);

        if (eventCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (authToken == null) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (user.length === 0) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else if (user[0].id !== eventCheck[0].organizer_id) {
            console.log(user[0].id);
            console.log(eventCheck[0].organizer_id);
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            await events.deleteEventAttendees(id);
            await events.deleteEventCategory(id);
            await events.deleteEvent(id);
            res.statusMessage = "OK";
            res.status(200).send();
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.categories = async function(req, res){
    try{
        const result = await events.getCategories();
        res.statusMessage = "OK";
        res.status(200).send(result);
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};