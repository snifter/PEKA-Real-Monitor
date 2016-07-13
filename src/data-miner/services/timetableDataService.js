let config = require('../config/global');
let BaseDataService = require('./baseDataService');
let moment = require('moment');

class TimetableDataService extends BaseDataService {

  constructor(bollardRepository, timetableRepository) {
    super();
    this.bollardRepository = bollardRepository;
    this.timetableRepository = timetableRepository;
  }

  updateAllTimetables() {
    return this.bollardRepository
              .getAllBollardCodes()
              .then((bollards) => {
                const chunkSize = 20;
                let chunks = [];
                while (bollards.length > 0) {
                  let temp = bollards.splice(0, chunkSize);
                  let codes = temp.map((bollard) => {
                    return bollard.code;
                  });
                  chunks.push(codes);
                }

                return chunks;
              }).then((chunks) => {
                let createFunction = (chunk) => {
                  return () => {
                    return Promise.all(chunk.map((code) => {
                      return this.getPromiseForCode(code);
                    }));
                  };
                };

                let promise = Promise.resolve();
                for(let chunk of chunks) {
                  promise = promise.then(createFunction(chunk));
                }

                return promise.then(() => {
                  //TODO remove console.log
                  console.log('end');
                  return Promise.resolve();
                });
              });
  }

  getPromiseForCode(code) {
    let url = this.getUrl(code);
    return this.fetchDataFromApi(url)
               .then((response) => {
                 let data = JSON.parse(response);
                 return this.convertToTimetable(data);
               }).then((departures) =>{
                 let promises = departures.map((departure) => {
                   return this.timetableRepository.insertIfNotExist(departure);
                 });

                 return Promise.all(promises);
               });
  }

  convertToTimetable(data) {
    let result = [];

    let day = moment(data.date, 'dddd, DD.MM.YYYY');

    for (let route of data.routes) {
      let line = route.name;

      for(let variant of route.variants) {
        let relation = variant.headsign;

        for (let service of variant.services) {
          let departuresDay = day.clone();

          for (let departure of service.departures) {
            let item = {
              bollard: data.stop,
              line: line,
              relation: relation,
              departure: departuresDay.clone()
                                      .hours(parseInt(departure.hours))
                                      .minutes(parseInt(departure.minutes))
                                      .toDate()
            };
            result.push(item);
          }
        }
      }
    }

    return result;
  }

  getUrl(code) {
    return config.services.timetableService
                  .timetableApiUrlFormat
                  .replace('<<bollard>>', code);
  }
}

module.exports = TimetableDataService;