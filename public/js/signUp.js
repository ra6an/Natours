/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (username, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name: username,
        email,
        password,
        passwordConfirm
      }
    });

    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'You created account successfuly!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data);
  }
};
