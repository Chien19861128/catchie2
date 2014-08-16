'use strict';

var purchasables = require('../controllers/purchasables');

// Purchasable authorization helpers
var hasAuthorization = function(req, res, next) {
    //if (!req.user.isAdmin && req.purchasables.user.id !== req.user.id) {
    //    return res.send(401, 'User is not authorized');
    //}
    next();
};

module.exports = function(Purchasables, app, auth) {

    app.route('/purchasables')
      .get(purchasables.all)
      .post(auth.requiresLogin, purchasables.create);
    app.route('/purchasables/me')
      .get(purchasables.me);
    app.route('/purchasables/:purchasableName')
      .get(purchasables.show)
      .put(auth.requiresLogin, hasAuthorization, purchasables.update)
      .delete(auth.requiresLogin, hasAuthorization, purchasables.destroy);
    app.route('/purchasables/:purchasableName/cart')
      .post(auth.requiresLogin, hasAuthorization, purchasables.addCartItem)
      .put(auth.requiresLogin, hasAuthorization, purchasables.updateCartItems);

    // Finish with setting up the purchasableName(vendorName-purchasableName) param
    app.param('purchasableName', purchasables.purchasable);
};
