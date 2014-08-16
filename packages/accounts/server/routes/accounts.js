'use strict';

var accounts = require('../controllers/accounts');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  //if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
    //return res.send(401, 'User is not authorized');
  //}
  next();
};

module.exports = function(Articles, app, auth) {

    app.route('/accounts/me')
      .get(accounts.me);
    app.route('/register')
      .post(accounts.create);
    app.route('/accounts/:accountName')
      .put(auth.requiresLogin, hasAuthorization, accounts.update);

    // Finish with setting up the accountName param
    app.param('accountName', accounts.account);

    
};
