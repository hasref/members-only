var express = require('express');
var router = express.Router();

const signUpController = require('../controllers/signup');
const loginController = require('../controllers/login');

/* GET home page. */
router.get('/', function (req, res) {
  console.log(req.user);
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/signup', signUpController.signUp);
router.post('/signup', signUpController.createUser);

router.get('/login', loginController.logIn);
router.post('/login', loginController.logInUser);

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

module.exports = router;
