const { body, validationResult, check } = require('express-validator');

const passport = require('passport');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

exports.signUp = (req, res, next) => {
  res.render('signupForm');
};

exports.createUser = [
  body('firstName').trim().isLength({ min: 1 }).escape(),
  body('familyName').trim().isLength({ min: 1 }).escape(),
  body('username').trim().isLength({ min: 1 }).escape(),
  body('password').isLength({ min: 8 }),

  check('username').custom((requestedName) => {
    return User.find({ username: requestedName }).then((users) => {
      if (users.length !== 0) {
        throw new Error('Username already exists');
      } else {
        return true;
      }
    });
  }),

  check('password').custom((value, { req }) => {
    if (value !== req.body.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    // returning true is required here
    return true;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // TODO: return filled form
      // with password cleared out
      return res.status(400).json({ errors: errors.array() });
    } else {
      // if no errors, create a user in the database and log them in
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = await new User({
          firstName: req.body.firstName,
          familyName: req.body.familyName,
          username: req.body.username,
          password: hashedPassword,
          membership: 'joined',
        }).save();

        // login is provided by passport.js
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/');
        });
      } catch (err) {
        // TODO: should we redirect the user to the
        // the login page here?
        console.error(
          `Failed to hash password/save user with error ${err.message}`
        );
        return next(err);
      }
    }
  },
];
