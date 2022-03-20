/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51Kf2lnGUM5AlmTkrLWNFKfwIuvgeSwAf4ABuEIZ9X0OQtfQI5yKiyiKyZtYCWGuVJ4Tsh4EdBwBsIw58PqJWznB8003Xc41FxB'
);

export const bookTour = async tourId => {
  try {
    // 1) get checkout session from server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) sreate checkout form + charge the credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
