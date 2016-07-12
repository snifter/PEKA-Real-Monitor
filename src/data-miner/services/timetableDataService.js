let config = require('../config/global');
let BaseDataService = require('./baseDataService');

class TimetableDataService extends BaseDataService {

  constructor(bollardRepository) {
    super();
    this.bollardRepository = bollardRepository;
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
                for(let i = 0; i < chunks.length; i++) {
                  promise = promise.then(createFunction(chunks[i]));
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
                 //TODO persist in db
                 console.log(data.stop);
                 return Promise.resolve();
               });
  }

  getUrl(code) {
    return config.services.timetableService
                  .timetableApiUrlFormat
                  .replace('<<bollard>>', code);
  }
}

module.exports = TimetableDataService;