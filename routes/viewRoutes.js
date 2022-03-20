const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.use();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signUp', authController.isLoggedIn, viewsController.getSignUpForm);
router.get('/me', authController.protect, viewsController.getAccount);
// router.get('/me', authController.protect, viewsController.getAccount);

// router.get(
//   '/myReviews',
//   authController.isLoggedIn,
//   viewsController.getMyReviews
// );
router.get('/forgotPassword', viewsController.forgotPassword);
router.get('/api/v1/users/resetPassword/:token', viewsController.resetPassword);

router.post('/me', authController.protect, viewsController.updateUser);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
