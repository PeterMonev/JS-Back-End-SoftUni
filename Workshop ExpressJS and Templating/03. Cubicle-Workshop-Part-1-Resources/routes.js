const router = require('express').Router();

const homeCotroller  = require('./controllers/homeCotroller');
const cubeController = require('./controllers/cubeController');

router.use('/',homeCotroller);
router.use('/cube',cubeController)

module.exports = router;

