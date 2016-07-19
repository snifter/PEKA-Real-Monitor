let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let timetableSchema = new Schema({
  bollard: {
    type: String,
    required: true,
    trim: true,
    ref: 'Bollard'
  },
  line: {
    type: String,
    required: true,
    trim: true,
    ref: 'Line'
  },
  relation: {
    type: String,
    required: true,
    trim: true
  },
  departure: {
    type: Date,
    required: true
  }
});

timetableSchema.index({
  bollard: 1,
  line: 1,
  relation: 1,
  departure: -1
});
timetableSchema.index({
  departure: 1
}, {
  expireAfterSeconds: 60 * 60 * 24
});

module.exports = mongoose.model('Timetable', timetableSchema);