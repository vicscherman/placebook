const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload')
const router = express();

router.get('/', usersController.getAllUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  usersController.createUser
);

router.post('/login', usersController.logIn);

module.exports = router;
