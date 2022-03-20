/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicmE2YW4iLCJhIjoiY2wwcXNpZWNhMmF0ODNkdW91MDY0OXBtdSJ9.F8e8MLAZYex5xV3gkS6jWg';
  // BUG sredit na mapbox siteu

  // pk.eyJ1IjoicmE2YW4iLCJhIjoiY2wwbzR3M3FpMTVpZjNicGU1N3p0aHkwciJ9.YpD6lTo0ZFd3OcYZ82YMWA

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ra6an/cl0o74qh8002515npk13b3n7l',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Add marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend the map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
