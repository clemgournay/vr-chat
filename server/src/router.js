const Router = require('express').Router;

const router = new Router();
const config = require('./config');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const authMiddleware = require('./middlewares/auth');
const loginController = require('./controllers/login');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const roomController = require('./controllers/room');
const userController = require('./controllers/user');


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// router.get('/login', authMiddleware.requireAuth, loginController.login);
router.get('/login', loginController.login);

// login facebook
passport.use(new FacebookStrategy({
    clientID: config.FB_APP_ID,
    clientSecret: config.FB_APP_SECRET,
    callbackURL: config.FB_CALLBACK_URL,
    profileFields: ['emails', 'name', 'photos', 'id', 'displayName']
  },
  loginController.saveUser
));

router.get('/login/facebook', (req, res, next) => {
  const roomID = (req.query.roomID) ? req.query.roomID : null;
  passport.authenticate('facebook', {scope: ['email'], state: roomID})(req,res,next);
});
router.get('/login/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: config.APP_FALLBACK}), (req, res) => {
      let url = config.APP_URL;
      console.log(req.query.state)
      if (req.query.state !== undefined)  url += '#' + req.query.state;
      res.redirect(url);
    }
);

// login google
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK
  },
  loginController.saveUser
));

router.get('/login/google', (req, res, next) => {
  const roomID = (req.query.roomID) ? req.query.roomID : null;
  passport.authenticate('google', {scope: ['profile', 'email'], state: roomID})(req,res,next);
});

router.get('/login/google/callback', 
  passport.authenticate('google', { failureRedirect: config.APP_FALLBACK }), (req, res) => {
    let url = config.APP_URL;
    if (req.query.state !== undefined)  url += '#' + req.query.state;
    res.redirect(url);
});

// logout social
router.get('/logout', function(req, res){
  let url = config.APP_URL;
  if (req.query.roomID) url += '/#' + req.query.roomID;
  req.logout();
  res.redirect(url);
});

// room api

if (config.ENV === 'local') {
    router.post('/rooms', roomController.create);
} else {
    router.post('/rooms', authMiddleware.requireAuth, roomController.create);
}


router.post('/rooms', roomController.create);
router.get('/rooms', roomController.getAll);
router.get('/rooms/:id', roomController.get);
router.put('/rooms/:id', roomController.update);
router.patch('/rooms/:id', roomController.update); 
router.delete('/rooms/:id', roomController.delete);
router.get('/rooms/:id/password/:password', roomController.password);

/* 
/* USER ENDPOINT 
*/

router.route('/users')
    .get(userController.index)
    .post(userController.new);
router.route('/users/:user_id')
    .get(userController.view)
    .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);

/* 
/* VOICE ROOM ENDPOINT 
*/
const VoiceRoom = require('./voice-room');

// Create VoiceRoom or Get if exists
router.get('/voice/:roomID', async function(req, res) {
  let roomID = req.params.roomID;
  let voiceRoom = VoiceRoom.get(roomID);
  if (voiceRoom === null) {
    voiceRoom = VoiceRoom.create(roomID);
  }
  res.json(voiceRoom.toJSON());
});

// Create a new VoiceRoom instance, and redirect
router.get('/voice/new/:roomID', async function(req, res) {
  let roomID = req.params.roomID;
  const voiceRoom = VoiceRoom.create(roomID);
  res.json(voiceRoom.toJSON());
});

// peeID: who is sharing screen
router.get('/voice/:roomID/update-sharing-screen/:peerID', function(req, res) {
  const roomID = req.params.roomID;
  const peerID = req.params.peerID;
  if(!req.params.roomID || !req.params.peerID) {
    res.status(400).json({message: 'bad request'});
  } else {
    const voiceRoom = VoiceRoom.get(roomID);
    voiceRoom.updateIsSharingScreen(peerID);
    res.json({message: 'success'});
  }
});


// Add PeerJS ID to VoiceRoom instance when someone opens the page
router.post('/voice/:roomID/addpeer/:peerid', function(req, res) {
  const voiceRoom = VoiceRoom.get(req.params.roomID);
  const userID = req.body.userID;
  if (!voiceRoom) return res.status(404).send('VoiceRoom not found');
  voiceRoom.addPeer({peerID: req.params.peerid, isSharingScreen: false, userID: userID});
  res.json(voiceRoom.toJSON());
});

module.exports = router;
