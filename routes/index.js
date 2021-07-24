var express = require('express');
var router = express.Router();

const signUpController = require('../controllers/signup');
const loginController = require('../controllers/login');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', signUpController.signUp);
router.post('/signup', signUpController.createUser);

router.get('/login', loginController.logIn);
router.post('/login', loginController.logInUser);

module.exports = router;
