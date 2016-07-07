let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let lineDirectionSchema = new Schema({
  direction: { type: Number, required: true },
  relation: { type: String, required: true, trim: true },
  bollards: [String]
}, { 
  _id: false 
});

let lineSchema = new Schema({
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
  day: Boolean,
  directions: [lineDirectionSchema]
});

module.exports = mongoose.model('Line', lineSchema);