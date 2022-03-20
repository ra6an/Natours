/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Update data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `You successufly updated your ${type.toUpperCase()}!`
      );
      // location.assign('/me');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
  // console.log(req.user.id);
};
