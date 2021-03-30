const eventsAttendees = require('../models/events.attendees.model');

const users = require('../models/users.model');

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
            const attendanceCheck = await eventsAttendees.checkAttendee(eventCheck[0].id, user[0].id);

            const currentDate = new Date();
            const dateObject = new Date(eventCheck[0].date);
            if (attendanceCheck.length === 0) {
                res.statusMessage = "Forbidden";
                res.status(403).send();
            } else if (dateObject < currentDate) {
                res.statusMessage = "Forbidden";
                res.status(403).send();
            } else if (attendanceCheck[0].status === 3) {
                res.statusMessage = "Forbidden";
                res.status(403).send();
            } else {
                await eventsAttendees.deleteAttendee(eventCheck[0].id, user[0].id);
                res.statusMessage = "OK";
                res.status(200).send();
            }
        }
    } catch( err ) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
    }
};

exports.update = async function(req, res){
    try{
        const userId = req.params.user_id;
        const eventId = req.params.event_id;
        const userCheck = users.getUser(userId);
        const eventCheck = await eventsAttendees.getEvent(eventId);

        let status = req.body.status;

        const authToken = req.header('X-Authorization');
        const user = await users.findToken(authToken);

        if (eventCheck.length === 0 || userCheck.length === 0) {
            res.statusMessage = "Not Found";
            res.status(404).send();
        } else if (authToken == null || user.length === 0) {
            res.statusMessage = "Unauthorized";
            res.status(401).send();
        } else {
            if (user[0].id !== eventCheck[0].organizer_id) {
                res.statusMessage = "Forbidden";
                res.status(403).send();
            } else {
                const attendanceCheck = await eventsAttendees.checkAttendee(eventId, userId);
                if (attendanceCheck.length === 0) {
                    res.statusMessage = "Bad Request";
                    res.status(400).send();
                } else {
                    if (status === 'accepted') {
                        await eventsAttendees.updateAttendee(1, eventId, userId);
                        res.statusMessage = "OK";
                        res.status(200).send();
                    } else if (status === 'pending') {
                        await eventsAttendees.updateAttendee(2, eventId, userId);
                        res.statusMessage = "OK";
                        res.status(200).send();
                    } else if (status === 'rejected') {
                        await eventsAttendees.updateAttendee(3, eventId, userId);
                        res.statusMessage = "OK";
                        res.status(200).send();
                    } else {
                        res.statusMessage = "Bad Request";
                        res.status(400).send();
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
