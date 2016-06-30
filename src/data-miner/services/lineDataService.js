let config = require('../config/global');
let BaseDataService = require('./baseDataService');

class LineDataService extends BaseDataService {

  constructor(lineRepository) {
    super();
    this.lineRepository = lineRepository;
  }

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
        let beginDataTag = '<ns:return>';
        let endDataTag = '</ns:return>';
        let beginIndex = responseBody.indexOf(beginDataTag) + beginDataTag.length;
        let endIndex = responseBody.indexOf(endDataTag);

        let dataString = responseBody.substring(beginIndex, endIndex);
        console.log(dataString);
        let data = JSON.parse(dataString);
        if (data.status !== 'ok') {
          reject(`api ${url} responses with status: ${data.status}`);
          return;
        }

        let promises = data.lines.map((line) => {
          return this.lineRepository
              .lineExist(line)
              .then((exist) => {
                if (!exist) {
                  this.lineRepository.insert({
                    name: line,
                    type: lineType,
                    day: day
                  }).catch(function(e) {
                    reject(e);
                  });
                }
              }).catch(function(e) {
                reject(e);
              });
        });

        console.log(`${lineType} lines data retrievied and processing`, 
                  'day', day);
        Promise.all(promises)
               .then(function() {
                  resolve();          
               });
      }).catch(function(error) {
        reject(error);
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

module.exports = LineDataService;