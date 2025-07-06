const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get('/', userController.findAll);
router.get('/:userId', userController.findOne);
router.post('/', userController.create);
router.patch('/:userId', userController.updateById);
router.delete('/:userId', userController.deleteById);

module.exports = router;