const events = require('../controllers/events.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/events')
        .get(events.read);

    app.route(app.rootUrl + '/events')
        .post(events.create);

    app.route(app.rootUrl + '/events/:id')
        .get(events.readEvent);

    app.route(app.rootUrl + '/events/:id')
        .patch(events.update);

    app.route(app.rootUrl + '/events/:id')
        .delete(events.delete);

    app.route(app.rootUrl + '/events/categories')
        .get(events.categories);
};