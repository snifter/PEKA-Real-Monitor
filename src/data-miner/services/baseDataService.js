let http = require('http');
let https = require('https');

class BaseDataService {
  
  fetchDataFromApi(url) {
    let client = url.startsWith('https:') ? https : http;
    return new Promise((resolve, reject) => {
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
        reject(e);        
      });

      request.end();
    });  
  }
}

module.exports = BaseDataService;
