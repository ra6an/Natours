const Tour = require('../models/tourModel');
// const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get all the tour data from the collection
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render the template using data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get tour data from the collection
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  // 2) Build template
  // 3) Render the template using tour data
  res
    .status(200)
    // NAKNADNO DODANO DA BI RADIO MAPBOX
    // .set(
    //   'Content-Security-Policy',

    //   "default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://is.stripe.com/V3 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login into your account'
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signUp', {
    title: 'SignUp'
  });
};

// exports.getAccount = (req, res) => {
//   res.status(200).render('account', {
//     title: 'Your account'
//   });
// };

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });

  // if (req.params.option === 'editUser') {
  //   return res.status(200).render('me', {
  //     title: 'Edit user'
  //   });
  // }
  // if (req.params.option === 'myReview') {
  //   return res.status(200).render('myReviews', {
  //     title: 'My reviews'
  //   });
  // }
};

exports.getMyReviews = (req, res) => {
  res.status(200).render('myReviews', {
    title: 'My reviews'
  });
};

exports.updateUser = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forget your password'
  });
};

exports.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset your password'
  });
};

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email
//     },
//     {
//       new: true,
//       runValidators: true
//     }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser
//   });
//   next();
// });
