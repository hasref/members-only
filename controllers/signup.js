const { body, validationResult, check } = require('express-validator');

exports.signUp = (req, res, next) => {
  res.render('signupForm');
};

exports.createUser = [
  body('firstname').trim().isLength({ min: 1 }).escape(),
  body('lastname').trim().isLength({ min: 1 }).escape(),
  body('username').trim().isLength({ min: 1 }).escape(),
  body('password').isLength({ min: 5 }),

  check('password').custom((value, { req }) => {
    if (value !== req.body.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    // returning true is required here
    return true;
  }),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // TODO: return filled form
      // with password cleared out
      return res.status(400).json({ errors: errors.array() });
    } else {
      res.send("We'll get back to you in a few days.");
    }
  },
];
