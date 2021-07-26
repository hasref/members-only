var express = require('express');
var router = express.Router();

const signUpController = require('../controllers/signup');
const loginController = require('../controllers/login');
const messageController = require('../controllers/message');

/* GET home page. */
router.get('/', messageController.showMessages);

router.get('/signup', signUpController.signUp);
router.post('/signup', signUpController.createUser);

router.get('/login', loginController.logIn);
router.post('/login', loginController.logInUser);

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

router.get('/new-message', messageController.newMessage);
router.post('/createmessage', messageController.createNewMessage);

module.exports = router;
