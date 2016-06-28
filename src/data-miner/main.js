let BollardRepository = require('./repositories/bollardRepository');
let BollardDataService = require('./services/bollardDataService');

let config = require('./config/global');
let mongoose = require('mongoose');
mongoose.connect(config.databases.mongodb.url);

let bollardRepository = new BollardRepository();
let bollardDataService = new BollardDataService(bollardRepository);
bollardDataService
  .updateData()
  .catch(function(e) {
    if (e.message) {
      console.warn(`Unable to download a stoppoint bollards: ${e.message}`);      
    } else {
      console.error(e);
    }
    console.warn('If it is first run, a system will not work properly!');
  });
