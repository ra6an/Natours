/* eslint-disable */
import 'core-js';
import 'regenerator-runtime/runtime';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signUp } from './signUp';
import { updateSettings } from './updateSettings';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';
import { getTour, getMyReviews, renderReviews } from './getMyReviews';
import { bookTour } from './stripe';
import { getMyBookings, renderBookings } from './myBookings';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const signUpForm = document.querySelector('.signup-form');
const loginAndSignupForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const forgotPasswordForm = document.querySelector('.forgot__password-form');
const resetPasswordForm = document.querySelector('.reset__password-form');
const userView = document.querySelector('.user-view');
const userOptions = document.querySelectorAll('.liste');
const forLoop = document.querySelectorAll('.for__loop');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginAndSignupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signUpForm) {
  loginAndSignupForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signUp(username, email, password, passwordConfirm);
  });
}

if (formUserData) {
  formUserData.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    updateSettings(form, 'data');
  });
}

if (formUserPassword) {
  formUserPassword.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (forgotPasswordForm) {
  loginAndSignupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    forgotPassword(email);
  });
}

if (resetPasswordForm) {
  loginAndSignupForm.addEventListener('submit', e => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    resetPassword(password, passwordConfirm);
    // console.log(password);
  });
}

if (userView) {
  const userId = document.getElementById('userId').dataset.userid;
  (async function(userId) {
    // GETTING ALL REVIEWS
    const reviews = await getMyReviews();

    // FILTERING ONLY REVIEWS FROM USER
    let myReviews = [];
    reviews.forEach(el => {
      if (el.user._id === userId) myReviews.push(el);
    });

    // LOOP THROUGH REVIEWS
    myReviews.forEach(async el => {
      // GETTING DATA ABOUT TOUR
      const tour = await getTour(el.tour);
      // RENDERING REVIEWS
      renderReviews(el, tour);
    });

    // GET ALL BOOKINGS
    const bookings = await getMyBookings();
    console.log(bookings);
    // RENDER BOOKINGS
    bookings.forEach(async el => {
      console.log(el.tour.id);
      await renderBookings(el, el.tour.id);
    });

    userOptions.forEach(els =>
      els.addEventListener('click', async el => {
        el.preventDefault();
        const element = el.target.closest('.liste');
        const dataSet = element.dataset.set;

        userOptions.forEach(e => e.classList.remove('side-nav--active'));
        forLoop.forEach(e => e.classList.add('hidden'));

        const content = document.querySelector(
          `.user-view__content-${dataSet}`
        );
        content.classList.remove('hidden');

        element.classList.add('side-nav--active');
        // const attribute = element.querySelector('a').getAttribute('href');
      })
    );
  })(userId);
}

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourid;
    bookTour(tourId);
  });
}
