var config = require('../config/global');
var http = require('http');

class BollardDataService { 
  fetchDataFromApi() {
    return new Promise(function(resolve, reject) {
      let request = http.request(config.stopPointBollardsApiUrl, (response) => {
        response.setEncoding('utf8');
        let responseBody = '';
        response.on('data', (chunk) => {
          responseBody += chunk;    
        });
        response.on('end', () => {
          var data = JSON.parse(responseBody);
          resolve(data);          
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
        reject(e);
        
      });

      request.end();
    });  
  }
}

module.exports = BollardDataService;
