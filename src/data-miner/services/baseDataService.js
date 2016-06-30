let http = require('http');

class BaseDataService {
  
  fetchDataFromApi(url) {
    return new Promise((resolve, reject) => {
      let request = http.request(url, (response) => {
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
        reject(e);        
      });

      request.end();
    });  
  }
}

module.exports = BaseDataService;
