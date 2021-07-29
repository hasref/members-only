const User = require('../models/user');

// TODO: this should be paginated
// and we need to make it searchable on the front-end
exports.showAdminPanel = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      res.redirect('/');
      return;
    }

    const users = await User.find({}).sort({ username: 'asc' });

    res.render('adminPanel', { userList: users, user: req.user });
    return;
  } catch (err) {
    next(err);
  }
};

exports.searchForUser = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    res.redirect('/');
    return;
  }

  try {
    const foundUser = await User.find({ username: req.body.usernameToSearch });
    if (foundUser) {
      res.render('adminPanel', { userList: foundUser, user: req.user });
    } else {
      res.render('adminPanel', {
        userList: undefined,
        user: req.user,
        msg: `could not find ${req.body.usernameToSearch}`,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.makeAdmin = async (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      res.redirect('/');
      return;
    }

    let user = await User.find({ username: req.params.username });
    user = user[0]; // username is unique

    const newIsAdmin = req.body.isAdmin === 'on' ? true : false;

    if (user) {
      user.isAdmin = newIsAdmin;
      await user.save();

      res.redirect('/adminPanel');
      return;
    } else {
      res.render('adminPanel', {
        msg: `Could not find user with username ${req.params.username} while trying to change permissions.`,
      });
      return;
    }
  } catch (err) {
    next(err);
  }
};
