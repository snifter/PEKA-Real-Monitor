let config = require('../config/global');
let http = require('http');

class BollardDataService {
  
  constructor(bollardRepository) {
    this.bollardRepository = bollardRepository;
  }
  
  updateData() {
    return new Promise((resolve, reject) => {
      this.fetchDataFromApi().then((data) => {        
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
        if (!data.features.length) {
          reject(Error('No bollard in data!'));
          return;
        }
        let promises = data.features.map((feature) => {
          return this.bollardRepository
              .bollardExist(feature.id)
              .then((exist) => {
                if (!exist) {
                  this.bollardRepository.insert({
                    name: feature.properties.stop_name,
                    code: feature.id,
                    position: feature.geometry.coordinates
                  }).catch(function(e) {
                    reject(e);
                  });
                }
              }).catch(function(e) {
                reject(e);
              });
        });
        
        Promise.all(promises)
               .then(function() {
                  resolve();          
               });
      });
    });    
  }
  
  fetchDataFromApi() {
    return new Promise((resolve, reject) => {
      let request = http.request(config.services.bollardDataService.stopPointBollardsApiUrl, (response) => {
        response.setEncoding('utf8');
        
        let responseBody = '';
        
        response.on('data', (chunk) => {
          responseBody += chunk;    
        });
        
        response.on('end', () => {
          let data = JSON.parse(responseBody);
          resolve(data);          
        });
      });

      request.on('error', (e) => {
        reject(e);        
      });

      request.end();
    });  
  }
}

module.exports = BollardDataService;
