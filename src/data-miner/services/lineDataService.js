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
               .then((lines) => {
                 let promise = Promise.resolve();
                 for (let line of lines) {
                   /*jshint -W083 */
                   promise = promise.then(() => {
                   /*jshint +W083 */
                     return this.fetchDirections(line);
                   }).then((item) => {
                     return this.fetchBollards(item);
                   }).then((item) => {
                     return this.persistLine(item);
                   });
                 }

                 return promise;
               });
  }

  getLines(lineType, day) {
    console.log('getLines', lineType, day);

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

  fetchDirections(line) {
    console.log('fetchDirections', line);

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

  fetchBollards(line) {
    console.log('fetchBollards', line);

    let promises = line.directions.map((item) => {
      let url = config.services.linesDataService
                .lineBollardsApiUrlFormat
                .replace('<<line>>', line.name)
                .replace('<<direction>>', item.direction);

      return this.fetchDataFromApi(url)
        .then((responseBody) => {
          let data = this.extractJson(responseBody);
          if (data.status !== 'ok') {
            throw Error(`api ${url} responses with status: ${data.status}`);
          }

          item.bollards = data.stops.map((stop) => {
            return stop.stop_id;
          });

          return Promise.resolve(line);
        });
    });

    return Promise.all(promises).then(() => {
      return line;
    });
  }

  persistLine(line) {
    console.log('persistLine', line);

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