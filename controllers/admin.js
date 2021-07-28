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
