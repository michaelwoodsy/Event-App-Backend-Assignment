const eventsAttendees = require('../models/events.attendees.model');

exports.read = async function(req, res){
    try{
        const id = req.params.id;
        const eventCheck = await eventsAttendees.getEvent(id);

        if (eventCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else {
            const result = await eventsAttendees.getAttendees(id);
            res.statusMessage = "OK";
            res.status(200).send(result);
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.add = async function(req, res){
    return null;
};

exports.delete = async function(req, res){
    return null;
};

exports.update = async function(req, res){
    return null;
};
