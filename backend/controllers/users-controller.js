const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    //we want to return without password hence -password
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Finding user failed', 500);
    return next(error);
  }
  //again find returns an array so we want to map it to an object in order to access the object and set getters to true
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid inputs to create an account', 422));
  }
  const { name, email, password } = req.body;
  //finds one document
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Sign up failed, please try again', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'There is already a user with this email address',
      422
    );
    return next(error);
  }

  //using bcrpyt to scramble password string on db end. 12 is the length of the input to the algo
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again', 500);
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image: req.file.location,
    password: hashedPassword,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError('There was a problem saving the user', 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('sign up failed', 500);
    return next(error);
  }

 
  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Incorrect credentials', 403);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Log in failed, possibly due to incorrect credentials',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Incorrect credentials', 401);
    return next(error);
  }
  //at this point the user and the encrypted password are correct. Time to generate a token
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Logging in failed', 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

exports.getAllUsers = getAllUsers;
exports.createUser = createUser;
exports.logIn = logIn;
