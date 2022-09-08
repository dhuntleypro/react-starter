import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      user.homeAddress = req.body.homeAddress || user.homeAddress;
      user.homeCity = req.body.homeCity || user.homeCity;
      user.homeState = req.body.homeState || user.homeState;
      user.homeZipCode = req.body.homeZipCode || user.homeZipCode;

      user.profileImageURL = req.body.profileImageURL || user.profileImageURL;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.loggedIn = req.body.loggedIn || user.loggedIn;
      user.cartHasItems = req.body.cartHasItems || user.cartHasItems;
      user.cartTotal = req.body.cartTotal || user.cartTotal;
      user.agreedToTerms = req.body.agreedToTerms || user.agreedToTerms;
      user.agreedtoTermsDate =
        req.body.agreedtoTermsDate || user.agreedtoTermsDate;
      user.agreedToContract =
        req.body.agreedToContract || user.agreedToContract;

      user.birthday = req.body.birthday || user.birthday;
      user.birthMonth = req.body.birthMonth || user.birthMonth;
      user.birthYear = req.body.birthYear || user.birthYear;
      user.gender = req.body.gender || user.gender;
      user.shirtSize = req.body.shirtSize || user.shirtSize;
      user.waistSizeInNumbers =
        req.body.waistSizeInNumbers || user.waistSizeInNumbers;
      user.pantsLength = req.body.pantsLength || user.pantsLength;
      user.waistSize = req.body.waistSize || user.waistSize;
      user.subscribed = req.body.subscribed || user.subscribed;
      user.subscribedToNewsletter =
        req.body.subscribedToNewsletter || user.subscribedToNewsletter;
      user.userIsActive = req.body.userIsActive || user.userIsActive;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,

        homeAddress: updatedUser.homeAddress,
        homeCity: updatedUser.homeCity,
        homeState: updatedUser.homeState,
        homeZipCode: updatedUser.homeZipCode,

        profileImageURL: updatedUser.profileImageURL,
        phoneNumber: updatedUser.phoneNumber,
        loggedIn: updatedUser.loggedIn,
        cartHasItems: updatedUser.cartHasItems,
        cartTotal: updatedUser.cartTotal,
        agreedToTerms: updatedUser.agreedToTerms,
        agreedtoTermsDate: updatedUser.agreedtoTermsDate,
        agreedToContract: updatedUser.agreedToContract,

        birthday: updatedUser.birthday,
        birthMonth: updatedUser.birthMonth,
        birthYear: updatedUser.birthYear,
        gender: updatedUser.gender,
        shirtSize: updatedUser.shirtSize,
        waistSizeInNumbers: updatedUser.waistSizeInNumbers,
        pantsLength: updatedUser.pantsLength,
        waistSize: updatedUser.waistSize,
        subscribed: updatedUser.subscribed,
        subscribedToNewsletter: updatedUser.subscribedToNewsletter,
        userIsActive: updatedUser.userIsActive,

        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);

      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,

      homeAddress: user.homeAddress,
      homeCity: user.homeCity,
      homeState: user.homeState,
      homeZipCode: user.homeZipCode,

      profileImageURL: user.profileImageURL,
      phoneNumber: user.phoneNumber,
      loggedIn: user.loggedIn,
      cartHasItems: user.cartHasItems,
      cartTotal: user.cartTotal,
      agreedToTerms: user.agreedToTerms,
      agreedtoTermsDate: user.agreedtoTermsDate,
      agreedToContract: user.agreedToContract,

      birthday: user.birthday,
      birthMonth: user.birthMonth,
      birthYear: user.birthYear,
      gender: user.gender,
      shirtSize: user.shirtSize,
      waistSizeInNumbers: user.waistSizeInNumbers,
      pantsLength: user.pantsLength,
      waistSize: user.waistSize,
      subscribed: user.subscribed,
      subscribedToNewsletter: user.subscribedToNewsletter,
      userIsActive: user.userIsActive,

      token: generateToken(user),
    });
  })
);

export default userRouter;
