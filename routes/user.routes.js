const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.middleware').verifyToken
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles;

router.get('/', userController.findAll);
router.get('/:userId', userController.findOne);
router.post('/', verifyToken, verifyRoles("admin"), userController.create);
router.patch('/:userId', verifyToken, verifyRoles("admin"), userController.updateById);
router.delete('/:userId', verifyToken, verifyRoles("admin"), userController.deleteById);

module.exports = router;