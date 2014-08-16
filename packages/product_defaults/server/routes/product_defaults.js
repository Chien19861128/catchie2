'use strict';

var product_defaults = require('../controllers/product_defaults');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  //if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
  //    return res.send(401, 'User is not authorized');
  //}
    next();
};

module.exports = function(ProductDefaults, app, auth) {

    app.route('/products/default')
      .get(product_defaults.all)
      .post(auth.requiresLogin, product_defaults.create);
    app.route('/products/:accountName-:productSku/default')
      .get(product_defaults.show)
      .put(auth.requiresLogin, hasAuthorization, product_defaults.update)
      .delete(auth.requiresLogin, hasAuthorization, product_defaults.destroy);

  // Finish with setting up the articleId param
  //app.param('articleId', product_defaults.product_default);
};
