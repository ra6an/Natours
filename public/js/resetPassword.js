/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const resetPassword = async (password, passwordConfirm) => {
  try {
    const token = location.pathname.split('/').pop();
    // console.log(token);

    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
        // token
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'You successfully reset your password!');
      location.assign('/');
    }
  } catch (err) {
    showAllert('error', err.response.data.message);
  }
};
