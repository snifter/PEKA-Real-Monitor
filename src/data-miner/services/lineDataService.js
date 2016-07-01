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
      this.fetchDataFromApi(url)
        .then((responseBody) => {
          let data = this.extractJson(responseBody);
          if (data.status !== 'ok') {
            throw Error(`api ${url} responses with status: ${data.status}`);
          }

          return data.lines.map((line) => {
            return { 
              name: line,
              type: lineType,
              day: day
            };
          });
        })/*.then((lines) => {
          return this.fetchDirections(lines);
        })*/
        .then((lines) => {
          let promises = lines.map(this.createPromiseForLine.bind(this));
          return Promise.all(promises);     
        }).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
    });
  }

  createPromiseForLine(line) {
    return this.persistLine(line);
  }

  fetchDirections(lines) {
    let promises = lines.map((line) => {
      let url = config.services.linesDataService
                    .directionsApiUrlFormat.replace('<<line>>', line.name);
      return this.fetchDataFromApi(url)
        .then((responseBody) => {
          let data = this.extractJson(responseBody);
          if (data.status !== 'ok') {
            throw Error(`api ${url} responses with status: ${data.status}`);
          }

          line.directions = data.relations.map((rel) => {
            return { 
              direction: rel.direction,
              relation: rel.relation
            };
          });

           return line;
        });  
    });

    return Promise.all(promises);
  }

  persistLine(line) {
    return this.lineRepository
      .lineExist(line.name)
      .then((exist) => {
        if (!exist) {
          return this.lineRepository.insert(line);
        } else {
          return Promise.resolve();
        }
      });
  }

  extractJson(responseBody) {
    let beginDataTag = '<ns:return>';
        let endDataTag = '</ns:return>';
        let beginIndex = responseBody.indexOf(beginDataTag) + beginDataTag.length;
        let endIndex = responseBody.indexOf(endDataTag);

        let dataString = responseBody.substring(beginIndex, endIndex);
        console.log(dataString);
        return JSON.parse(dataString);
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