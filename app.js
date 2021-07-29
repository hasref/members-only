var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

// TODO: when requesting a protected route, if not authenticated
// instead of redirecting to /, respond with 404.

require('dotenv').config();
mongoose.connect(process.env.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // TODO: Read up on this.
    saveUninitialized: true,
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    store: new MongoDBStore({
      uri: process.env.DB_URL,
      collection: 'sessions',
    }),
  })
);

// passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, async function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isValidPassword = await user.validPassword(password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log('password:', isValidPassword);
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
