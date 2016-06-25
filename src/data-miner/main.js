var config = require('./config/global');
var http = require('http');


var request = http.request(config.stopPointBollardsApiUrl, (response) => {
  response.setEncoding('utf8');
  var responseBody = '';
  response.on('data', (chunk) => {
    responseBody += chunk;    
  });
  response.on('end', () => {
    var data = JSON.parse(responseBody);
    for (var i = 0; i < data.features.length; i++) {
      console.log(data.features[i].id, data.features[i].properties.stop_name);
    }
    /*
    response format

    {"features": [
      {  
         "geometry":{  
            "coordinates":[  
               16.9343,
               52.39924
            ],
            "type":"Point"
         },
         "id":"AWF41",
         "type":"Feature",
         "properties":{  
            "zone":"A",
            "route_type":"0",
            "headsigns":"6, 9, 12, 18, 20, 27",
            "stop_name":"AWF"
         }
      },
      ...
      ],
      "crs":{"type":"none","properties":{"info":"no information"}},
      "type":"FeatureCollection"
    }
    */
  })
});

request.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

request.end();

