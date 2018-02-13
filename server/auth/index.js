const router = require('express').Router();


router.use('/google',require('./googleRouter'))

router.use('/local', require('./local'));



module.exports = router;