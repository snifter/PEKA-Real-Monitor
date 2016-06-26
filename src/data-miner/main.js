var BollardDataService = require('./services/bollardDataService');

var bollardDataService = new BollardDataService();
var promise = bollardDataService.fetchDataFromApi();

promise.then(function(data) {
  for (var i = 0; i < data.features.length; i++) {
    console.log(data.features[i].id, data.features[i].properties.stop_name);
  }
}).catch(function(e) {
  console.error(`problem with request: ${e.message}`);
});
