let Bollard = require('./models/bollard');

class BollardRepository {

  bollardExist(code) {
    return new Promise((resolve, reject) => {
      Bollard.findById(code, function(error, bollard) {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          let result = !!bollard;
          resolve(result);
        }
      });
    });
  }

  insert(data) {
    /*
      {
        name: String,
        code: String,
        position: [longitude,latitude]
      }
    */
    return new Promise((resolve, reject) => {
      let bollard = new Bollard({
        _id: data.code,
        code: data.code,
        name: data.name,
        position: {
          type: 'Point',
          coordinates: data.position
        }
      });
      bollard.save((error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log(`bollard ${data.code} saved`);
          resolve(bollard);
        }
      });
    });
  }
}

module.exports = BollardRepository;