let config = require('../config/global');
let BaseDataService = require('./baseDataService');

class BollardDataService extends BaseDataService {
  
  constructor(bollardRepository) {
    super();
    this.bollardRepository = bollardRepository;
  }
  
  updateData() {
    let url = config.services.bollardDataService.stopPointBollardsApiUrl;
    return this.fetchDataFromApi(url)
      .then((responseBody) => {
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
          throw Error('No bollard in data!');
        }
        let promises = data.features.map((feature) => {
          return this.bollardRepository
            .bollardExist(feature.id)
            .then((exist) => {
              if (!exist) {
                return this.bollardRepository.insert({
                  name: feature.properties.stop_name,
                  code: feature.id,
                  position: feature.geometry.coordinates
                });
              } else {
                return Promise.resolve();
              }
            });
        });
        console.log('bollards data retrievied and processing');
        return Promise.all(promises);
      });
  }
}

module.exports = BollardDataService;
