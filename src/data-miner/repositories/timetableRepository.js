let Timetable = require('./models/timetable');

class TimetableRepository {

  insertIfNotExist(data) {
    /*
      {
        bollard: String,
        line: String,
        relation: String,
        departure: Date
      }
    */
    return Timetable.findOne(data).then((existing) => {
      if (!existing) {
        console.log('not exist', data);
        return new Timetable(data).save();
      } else {
        console.log('exist', data);
        return Promise.resolve(existing);
      }
    });
  }
}

module.exports = TimetableRepository;