
const request = require(`request`);
const URL = `https://api.ipify.org?format=json`;
const GEO = `https://api.freegeoip.app/json/?apikey=081e2860-7a6f-11ec-9ea3-4d009937e70e`;

//fetch IP
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(URL, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ip. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    //body.body, containing the ip addy, is string type, therefore can JSONparse it into an object and retrive only the values (the actual ip address, without "ip")
    const parseBody = JSON.parse(body);
    const ip = parseBody.ip;
    callback(null, ip);
  });
};


//fetch coordinates
const fetchCoordsByIP = function(ip, callback) {
  // console.log(`ip Adress: `, ip);
  request(`${GEO}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = "invalid ip address. Location not found";
      callback(Error(msg), null);
      return;
    }

    const ipBasedLocation = JSON.parse(body);
    const coordinates = {};
    coordinates.latitude = ipBasedLocation.latitude;
    coordinates.longitude = ipBasedLocation.longitude;
    callback(null, coordinates);
  });
};


// ISS
const fetchISSFlyOverTimes = function(coords, callback) {
  // console.log(`Coordinates from previous function`, coords);

  const latitude = coords.latitude;
  const longitude = coords.longitude;

  request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `invalid coordinates, or something. \n ${response.statusCode} \n`;
      callback(Error(msg), null);
      return;
    }
    const passes = JSON.parse(body).response;
    // console.log(passes);
    callback(null, passes);
  });
};

//solution from compass
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};
// console.log(`data from previous coord function: `, data);
// console.log(`data type: `, typeof data);

// let results = "";
// for (const passTime in data){
//   results += `Next pass at ${data[passTime].risetime} for ${data[passTime].duration} seconds!`;

// }
// callback(null, fetchCoordsByIP())
// 1. retrieve the ip
// 2 .retrieve the coordinates
// 3. retrieve the pass over times


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };