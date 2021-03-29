const usersImages = require('../controllers/users.images.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/users/:id/image')
        .get(usersImages.read);

    app.route(app.rootUrl + '/users/:id/image')
        .put(usersImages.set);

    app.route(app.rootUrl + '/users/:id/image')
        .delete(usersImages.delete);
};