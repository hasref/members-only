const passport = require('passport');

exports.logIn = (req, res) => {
  res.render('loginForm');
};
// TODO: render login page with specific error
// TODO: Can we provide error message while using
// passport.authenticate as middleware and calling it manually?
exports.logInUser = (req, res, next) => {
  passport.authenticate('local', function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/');
    });
  })(req, res, next);
};
