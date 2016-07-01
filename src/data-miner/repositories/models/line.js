let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LineSchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['bus', 'tram']
  },
  day: Boolean
});

module.exports = mongoose.model('Line', LineSchema);