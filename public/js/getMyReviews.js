/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const getMyReviews = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/reviews'
      // responseType: 'json'
      // transformResponse: [function (data) {
      //   return data
      // }]
    });
    // console.log(res);
    return res.data.data.data;
  } catch (err) {
    showAlert('error', 'Error getting my reviews');
  }
};

export const renderReviews = (data, tour) => {
  const container = document.querySelector('.user-view__content-3');
  const reviewDate = data.createdAt.split('T')[0];
  // console.log(reviewDate);
  // const dataTour = dataTwo;
  const html = `
  <div class="line">&nbsp;</div>
  <div class="review-user">
    <div class="review-header__flex">
      <a class="review-link" href="/tour/${tour.slug}">
        <h2 class="heading-tour__review">${tour.name}</h2>
      </a>      
      <a class="review-delete__btn">
        <svg class="review-icon">
          <use xlink:href='img/icons.svg#icon-delete'></use>
        </svg>
      </a>
    </div>
        
    <div class="rev-text__user">
      <p class="review-text__user">${data.review}</p>
      <p class="review-date__user">${reviewDate}</p>
    </div>
  </div>
  `;

  // svg
  //       use(xlink:href=`img/icons.svg#icon-${icon}`)

  container.insertAdjacentHTML('beforeend', html);
};

// export const getAllTours = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: 'http://127.0.0.1:3000/api/v1/tours'
//       // transformResponse: [
//       //   function(data) {
//       //     console.log(data);
//       //   }
//       // ]
//     });
//     // console.log(res);
//     return res.data.data.data;
//   } catch (err) {
//     showAlert('error', 'Error getting all tours');
//   }
// };

export const getTour = async id => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/tours/${id}`
    });
    // console.log(res);
    return res.data.data.data;
  } catch (err) {
    showAlert('error', 'Error getting all tours');
  }
};
