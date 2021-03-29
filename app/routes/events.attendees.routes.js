const eventsAttendees = require('../controllers/events.attendees.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/events/:id/attendees')
        .get(eventsAttendees.read);

    app.route(app.rootUrl + '/events/:id/attendees')
        .post(eventsAttendees.add);

    app.route(app.rootUrl + '/events/:id/attendees')
        .delete(eventsAttendees.delete);

    app.route(app.rootUrl + '/events/:id/attendees/:id')
        .patch(eventsAttendees.update);
};