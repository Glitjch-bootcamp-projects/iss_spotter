const { nextISSTimesForMyLocation, printPassTimes } = require('./iss_promised');


nextISSTimesForMyLocation()
  .then(PassTimes => {
    printPassTimes(PassTimes);
  })
  .catch(error => {
    console.log("error. It didn't work", error.message);
  });
