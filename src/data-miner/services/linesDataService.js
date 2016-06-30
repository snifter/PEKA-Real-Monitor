let config = require('../config/global');
let BaseDataService = require('./baseDataService');

class LinesDataService extends BaseDataService {

  updateDayBusLines() {
    return this.updateData('bus', true);
  }

  updateNightBusLines() {
    return this.updateData('bus', false);
  }

  updateDayTramLines() {
    return this.updateData('tram', true);
  }

  updateNightTramLines() {
    return this.updateData('tram', false);
  }

  updateData(lineType, day) {
    return new Promise((resolve, reject) => {
      let url = this.getUrl(lineType, day);
      this.fetchDataFromApi(url).then((responseBody) => {
        console.log(responseBody);
        resolve();
      });
    });
  }

  getUrl(lineType, day) {
    let url;
    switch (lineType) {
      case 'bus':
        if (day) {
          url = config.services.linesDataService.dayBusLinesApiUrl;
        } else {
          url = config.services.linesDataService.nightBusLinesApiUrl;
        }
        break;
      case 'tram':
        if (day) {
          url = config.services.linesDataService.dayTramLinesApiUrl;
        } else {
          url = config.services.linesDataService.nightTramLinesApiUrl;
        }
        break;
        default: throw Error(`Unknown lineType: ${lineType}`);
    }

    return url;
  }
}

module.exports = LinesDataService;