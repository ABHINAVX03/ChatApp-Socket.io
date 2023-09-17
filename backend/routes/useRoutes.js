const express = require('express');
const { registerUser,authuser,allUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router()

router.route('/').post(registerUser).get(protect,allUser)
router.post('/login',authuser)

module.exports = router;