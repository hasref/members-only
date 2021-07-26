const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

exports.showMessages = async (req, res, next) => {
  try {
    if (req.user) {
      const messages = await Message.find({})
        .populate('author')
        .sort({ timestamp: 'desc' });
      res.render('index', { messages: messages, user: true });
    } else {
      const messages = await Message.find({})
        .select('-author')
        .sort({ timestamp: 'desc' });

      res.render('index', { messages: messages, user: false });
    }
  } catch (err) {
    next(err);
  }
};

exports.newMessage = (req, res, next) => {
  // TODO: we could probably do such a check in a dedicated middleware
  if (req.user) {
    res.render('messageForm', { user: req.user });
  } else {
    res.redirect('/login');
  }
};

exports.createNewMessage = [
  (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    } else {
      next();
    }
  },

  body('messageTitle').trim().isLength({ min: 1 }).escape(),
  body('messageBody').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    } else {
      new Message({
        messageTitle: req.body.messageTitle,
        messageBody: req.body.messageBody,
        author: req.user._id,
        // using default timestamp
      })
        .save()
        .then(() => {
          res.redirect('/');
        })
        .catch(next);
    }
  },
];
