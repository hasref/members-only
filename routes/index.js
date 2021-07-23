var express = require('express');
var router = express.Router();

const signUpController = require('../controllers/signup');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', signUpController.signUp);

module.exports = router;
