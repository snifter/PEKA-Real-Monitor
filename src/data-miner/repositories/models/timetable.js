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
  departureTime: {
    type: Date,
    required: true
  }
});

timetableSchema.index({
  bollard: 1,
  line: 1,
  departureTime: -1
});

module.exports = mongoose.model('Timetable', timetableSchema);