const router = require('express').Router();
const { auth, adminOnly } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

router.post('/login', ctrl.login);
router.post('/register', auth, adminOnly, ctrl.register);
router.get('/me', auth, ctrl.me);

module.exports = router;
