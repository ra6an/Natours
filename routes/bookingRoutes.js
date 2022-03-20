const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

// mergali smo parametre da bi mogli koristit tourId iz tour routera
const router = express.Router();

router.get('/my-bookings', bookingController.getMyBookings);

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo(['admin', 'lead-guide']));

router
  .get('/', bookingController.getAllBookings)
  .post('/', bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
