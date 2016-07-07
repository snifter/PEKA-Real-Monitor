let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bollardSchema = new Schema({
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
  code: {
    type: String,
    required: true,
    trim: true
  },
  position: [Number]
});

module.exports = mongoose.model('Bollard', bollardSchema);