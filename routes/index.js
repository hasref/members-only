var express = require('express');
var router = express.Router();

const signUpController = require('../controllers/signup');
const loginController = require('../controllers/login');
const messageController = require('../controllers/message');
const adminController = require('../controllers/admin');

/* GET home page. */
router.get('/', messageController.showMessages);
router.get('/signup', signUpController.signUp);
router.post('/signup', signUpController.createUser);

router.get('/login', loginController.logIn);

// let's start here

router.post('/login', loginController.logInUser);

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

router.get('/new-message', messageController.newMessage);
router.post('/createmessage', messageController.createNewMessage);

router.post('/message/:messageId/delete', messageController.deleteMessage);

// admin panel
router.get('/adminPanel', adminController.showAdminPanel);
router.post('/adminPanel/searchForUser', adminController.searchForUser);

router.post('/adminPanel/makeAdmin/:username', adminController.makeAdmin);

module.exports = router;
