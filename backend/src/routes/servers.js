const router = require('express').Router();
const { auth } = require('../middleware/auth');
const c = require('../controllers/serverController');

router.use(auth);
router.get('/', c.list);
router.get('/:id', c.get);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);
router.post('/bulk-delete', c.bulkDelete);

module.exports = router;
