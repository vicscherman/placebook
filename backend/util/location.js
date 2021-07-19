const axios = require('axios');
const HttpError = require('../models/http-error');


const getCoordsForAddress = async (address) => {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  
  const response = await axios.get(url);

  const data = response.data;
  //If no results are found
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      'Could not find a location with that address',
      422
    );
    throw error;
  }
  //using data.candidates as it's the places API we're using. Documentation here
  //https://developers.google.com/maps/documentation/places/web-service/search
  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAddress;
