let BollardRepository = require('./repositories/bollardRepository');
let BollardDataService = require('./services/bollardDataService');
let LineDataService = require('./services/lineDataService');
let LineRepository = require('./repositories/lineRepository');
let TimetableRepository = require('./repositories/timetableRepository');
let TimetableDataService = require('./services/timetableDataService');
let moment = require('moment');
moment.locale('pl');

let config = require('./config/global');
let mongoose = require('mongoose');
mongoose.connect(config.databases.mongodb.url);
// Use native promises
mongoose.Promise = global.Promise;

let bollardRepository = new BollardRepository();
let bollardDataService = new BollardDataService(bollardRepository);
let lineRepository = new LineRepository();
let lineDataService = new LineDataService(lineRepository);
let timetableRepository = new TimetableRepository();
let timetableDataService = new TimetableDataService(bollardRepository,
                                                    timetableRepository);

bollardDataService.updateData()
  .then(() => {
    return lineDataService.updateDayBusLines();
  }).then(() => {
    return lineDataService.updateNightBusLines();
  }).then(() => {
    return lineDataService.updateDayTramLines();
  }).then(() => {
    return lineDataService.updateNightTramLines();
  }).then(() => {
    return timetableDataService.updateAllTimetables();
  }).catch(function(e) {
    if (e.message) {
      console.warn(`Unable to download a data from api: ${e.message}`);
    } else {
      console.error(e);
    }
    console.warn('If it is first run, a system will not work properly!');
  });
