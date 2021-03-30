const eventsAttendees = require('../models/events.attendees.model');
const users = require('../models/users.model');
const events = require('../models/events.model');

exports.read = async function(req, res){
    try{
        const id = req.params.id;
        const eventCheck = await eventsAttendees.getEvent(id);

        const authToken = req.header('X-Authorization');

        if (eventCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (authToken == null) {
            const result = await eventsAttendees.getAttendees(id);
            res.statusMessage = "OK";
            res.status(200).send(result);
        } else {
            const tokenCheck = await users.findToken(authToken);
            if (tokenCheck.length !== 0) {
                const userId = tokenCheck[0].id;
                if (userId === eventCheck[0].organizer_id) {
                    const result = await eventsAttendees.getAttendeesAll(id);
                    res.statusMessage = "OK";
                    res.status(200).send(result);
                } else {
                    const result = await eventsAttendees.getAttendeesSelf(id, userId);
                    res.statusMessage = "OK";
                    res.status(200).send(result);
                }
            } else {
                const result = await eventsAttendees.getAttendees(id);
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

//Check to see if there is already and event with the same date, title and categories
exports.add = async function(req, res){
    try{
        const id = req.params.id;
        const eventCheck = await eventsAttendees.getEvent(id);

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
        } else {
            const attendanceCheck = await eventsAttendees.getAttendee(id, user[0].id);

            const currentDate = new Date();
            const dateObject = new Date(eventCheck[0].date);
            if (attendanceCheck.length !== 0) {
                res.statusMessage = "Forbidden";
                res.status(403).send();
            } else if (dateObject < currentDate) {
                res.statusMessage = "Forbidden";
                res.status(403).send();
            } else {
                await eventsAttendees.addAttendee(eventCheck[0].id, user[0].id, 2);
                res.statusMessage = "OK";
                res.status(201).send();
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.delete = async function(req, res){
    return null;
};

exports.update = async function(req, res){
    return null;
};
