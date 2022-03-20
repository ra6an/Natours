/*eslint-disable*/

import axios from 'axios';
import { showAlert } from './alerts';

export const getMyBookings = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/bookings/my-bookings`
    });

    // console.log('❤❤❤', res.data.data.data);
    return res.data.data.data;
  } catch (err) {
    showAlert('error', 'There is no bookings!');
  }
};

const getTour = async id => {
  try {
    console.log(id);
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/tours/${id}`
    });

    console.log('❤❤❤', res.data.data.data);
    return res.data.data.data;
  } catch (err) {
    showAlert('error', 'There is no tours!');
  }
};

export const renderBookings = async (data, tourId) => {
  try {
    const container = document.querySelector('.user-view__content-2');
    const tour = await getTour(tourId);
    console.log(tour);
    // const reviewDate = data.createdAt.split('T')[0];
    // console.log(reviewDate);
    // const dataTour = dataTwo;
    const html = `
      <div class="line">&nbsp;</div>
      <div class='card booked__card'>
        <div class='card__header'>
          <div class='card__picture'>
            <div class='card__picture-overlay'>&nbsp</div>
            <img class='card__picture-img' src='img/tours/${
              tour.imageCover
            }' alt='${tour.name}' />
          </div>
          <h3 class='heading-tertirary'>
          <span>${tour.name}</span>
          </h3>
        </div>
        <div class='card__details'>

          <h4 class='card__sub-heading'>${tour.difficulty} ${
      tour.duration
    }-day tour</h4>
          <p class='card__text'>${tour.summary}</p>
          <div class='card__data'>
            <svg class='card__icon'>
              <use xlink:href='img/icons.svg#icon-map-pin'></use>
            </svg>
            <span>${tour.startLocation.description}</span>
          </div>

          <div class='card__data'>
            <svg class='card__icon'>
              <use xlink:href='img/icons.svg#icon-calendar'></use>
            </svg>
            <span>${tour.startDates[0].split('T')[0]}</span>
          </div>

          <div class='card__data'>
            <svg class='card__icon'>
              <use xlink:href='img/icons.svg#icon-flag'></use>
            </svg>
            <span>${tour.locations.length} size</span>
          </div>

          <div class='card__data'>
            <svg class='card__icon'>
              <use xlink:href='img/icons.svg#icon-user'></use>
            </svg>
            <span>${tour.maxGroupSize} people</span>
          </div>

        </div>
        <div class='card__footer'>
          <a class='btn btn--green btn--small' href='/tour/tour.slug'>Booked</a>
        </div>
      
      </div>
    `;

    //         .card__details
    //           h4.card__sub-heading= `${tour.difficulty} ${tour.duration}-day tour`
    //           p.card__text= tour.summary
    //           .card__data
    //             svg.card__icon
    //               use(xlink:href='img/icons.svg#icon-map-pin')
    //             span= tour.startLocation.description
    //           .card__data
    //             svg.card__icon
    //               use(xlink:href='img/icons.svg#icon-calendar')
    //             span= tour.startDates[0].toLocaleString('en-us', {month: 'long', year: 'numeric'})
    //           .card__data
    //             svg.card__icon
    //               use(xlink:href='img/icons.svg#icon-flag')
    //             |
    //             span= `${tour.locations.length} stops`
    //           .card__data
    //             svg.card__icon
    //               use(xlink:href='img/icons.svg#icon-user')
    //             span= `${tour.maxGroupSize} people`

    container.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    showAlert('error', 'There is a problem with rendering bookings!');
  }
};
