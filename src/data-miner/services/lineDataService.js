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
    return this.getLines(lineType, day)
               .then(this.getDirections.bind(this));
  }

  getLines(lineType, day) {
    let url = this.getUrl(lineType, day);
    return this.fetchDataFromApi(url)
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
      });
  }

  getDirections(lines) {
    if (!lines.length) {
      return Promise.resolve();
    }

    let createFunction = (line) => {
      return () => {
        return this.createPromiseForLine(line);
      };
    };

    /*
    It would be better, but in environments with small RAM 
    it exhauts all resoruces and system stops.

    let promises = lines.map(this.createPromiseForLine.bind(this));
    return Promise.all(promises);
    */     
    let promise = this.createPromiseForLine(lines[0]);
    for (let i = 1; i < lines.length; i++) {
      let next = createFunction(lines[i]);
      promise = promise.then(next);
    }
    return promise;
  }

  createPromiseForLine(line) {
    return this.fetchDirections(line)
      .then(this.persistLine.bind(this));
  }

  fetchDirections(line) {
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

        return Promise.resolve(line);
      });
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