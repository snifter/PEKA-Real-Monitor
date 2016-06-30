let http = require('http');

class BaseDataService {
  
  fetchDataFromApi() {
    return new Promise((resolve, reject) => {
      let url = this.getUrl();
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

  getUrl() {
    throw new Error('getUrl method should be overidden in derived class');
  }
}

module.exports = BaseDataService;
