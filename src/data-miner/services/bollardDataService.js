let config = require('../config/global');
let BaseDataService = require('./baseDataService');

class BollardDataService extends BaseDataService {
  
  constructor(bollardRepository) {
    super();
    this.bollardRepository = bollardRepository;
  }
  
  updateData() {
    return new Promise((resolve, reject) => {
      let url = config.services.bollardDataService.stopPointBollardsApiUrl;
      this.fetchDataFromApi(url).then((responseBody) => {
          let data = JSON.parse(responseBody);        
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
}

module.exports = BollardDataService;
