let http = require('http');
let https = require('https');

class BaseDataService {

  fetchDataFromApi(url) {

    let client = url.startsWith('https:') ? https : http;
    return new Promise((resolve, reject) => {
      let retryLimit = 10;
      let retry = 0;
      let makeRequest = () => {
        console.log('fetchDataFromApi', url);

        let request = client.request(url, (response) => {
          response.setEncoding('utf8');

          let responseBody = '';

          response.on('data', (chunk) => {
            responseBody += chunk;
          });

          response.on('end', () => {
            resolve(responseBody);
          });
        });

        request.on('error', (e) => {
          console.log('Error', e);

          if (++retry <= retryLimit) {
            console.log('retry', retry, 'of', retryLimit);
            let delay = 1000 * retry;
            console.log('delay', delay);
            setTimeout(makeRequest, delay);
          } else {
            reject(e);
          }
        });

        request.on('socket', (socket) => {
          let timeout = 5000;
          socket.setTimeout(timeout, () => {
            console.log('Request timeout', timeout);
            request.abort();
          });
        });

        request.end();
      };

      makeRequest();
    });
  }
}

module.exports = BaseDataService;
