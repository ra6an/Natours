/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Email is sent successfully! Check out your Email inbox.'
      );
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
