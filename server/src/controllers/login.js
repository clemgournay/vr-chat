const User = require('../models/user');
exports.login = function (req, res) {
  console.log(req.user);
  if(req.user.charsetIMG == undefined) {
    req.user.charsetIMG = './assets/charsets/1.png';
  }
  res.json(req.user);
};

exports.saveUser = (accessToken, refreshToken, profile, done) => {

  let name = profile.displayName ? profile.displayName : '';
  let email = profile.emails ? profile.emails[0].value : '';
  let avatar = profile.photos ? profile.photos[0].value : '';
  if (avatar == '') {
    avatar = profile.pictureUrl ? profile.pictureUrl : '';
  }
  User.findOrCreate({ socialId: profile.id }, { socialId: profile.id, name: name, email: email, avatar: avatar }, (err, user) => {
    return done(err, user);
  });
}

