let Line = require('./models/line');

class LineRepository {
  
  lineExist(name) {
    return new Promise((resolve, reject) => {
      Line.findById(name, function(error, line) {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          let result = !!line;
          resolve(result);
        }
      });
    });
  }
  
  insert(data) {
    /*
      {
        name: String,
        type: String,
        day: Boolean,
        directions: [{
          direction: Number,
          relation: String
        }]
      }
    */
    return new Promise((resolve, reject) => {
      let line = new Line({
        _id: data.name,
        name: data.name,
        type: data.type,
        day: data.day,
        directions: data.directions
      });
      line.save((error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log(`line ${data.name} saved`);
          resolve(line);
        }
      });
    });
  }
}

module.exports = LineRepository;