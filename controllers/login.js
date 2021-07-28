const passport = require('passport');
const { body, validationResult } = require('express-validator');

exports.logIn = (req, res) => {
  return res.render('loginForm');
};
// TODO: render login page with specific error
// TODO: Can we provide error message while using
// passport.authenticate as middleware and calling it manually?
exports.logInUser = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('username cannot be empty')
    .escape(),

  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('password cannot be empty'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('loginForm', { errors: errors.array() });
      return;
    }

    next();
  },

  (req, res, next) => {
    passport.authenticate('local', function (err, user) {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        res.render('loginForm', {
          errors: [{ msg: 'username or password is wrong' }],
        });
        return;
      }
      req.logIn(user, function (err) {
        if (err) {
          next(err);
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res, next);
  },
];
