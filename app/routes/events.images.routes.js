const eventsImages = require('../controllers/events.images.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/events/:id/image')
        .get(eventsImages.read);

    app.route(app.rootUrl + '/events/:id/image')
        .put(eventsImages.set);
};