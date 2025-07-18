const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// PATCH /api/users/:id → update password
router.patch('/:id', userController.updatePassword);

router.get('/', userController.getAllUsers);

module.exports = router;