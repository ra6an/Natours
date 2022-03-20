const Stripe = require('stripe');
// const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // setting our secret key
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  // 1) get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) create checkout checkout session
  const session = await stripe.checkout.sessions.create({
    // information about session
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    // information about product
    line_items: [
      {
        description: tour.summary,
        price_data: {
          unit_amount: tour.price * 100,
          currency: 'usd',
          product_data: {
            name: tour.name,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
          }
        },
        quantity: 1
      }
    ]
  });

  // 3) create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is temporary, bcs everyone can make bookings witouth paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  // console.log(tour, user, price);
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const userId = req.cookies.client_id;
  const doc = await Booking.find({ user: { $eq: userId } });
  // console.log(doc);

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
