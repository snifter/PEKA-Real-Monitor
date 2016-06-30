let BollardRepository = require('./repositories/bollardRepository');
let BollardDataService = require('./services/bollardDataService');
let LinesDataService = require('./services/linesDataService');

let config = require('./config/global');
let mongoose = require('mongoose');
mongoose.connect(config.databases.mongodb.url);

let bollardRepository = new BollardRepository();
let bollardDataService = new BollardDataService(bollardRepository);
let linesDataService = new LinesDataService();

let promises = [
  bollardDataService.updateData(),
  linesDataService.updateDayBusLines(),
  linesDataService.updateNightBusLines(),
  linesDataService.updateDayTramLines(),
  linesDataService.updateNightTramLines()
];

Promise.all(promises)
      .catch(function(e) {
        if (e.message) {
          console.warn(`Unable to download a data from api: ${e.message}`);      
        } else {
          console.error(e);
        }
        console.warn('If it is first run, a system will not work properly!');
      });
