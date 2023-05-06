const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: [true, 'add flight number'],
  },
  launchDate: {
    type: Date,
    required: [true, 'add launch Date'],
  },
  mission: {
    type: String,
    required: [true, 'add mission name'],
  },
  rocket: {
    type: String,
    required: [true, 'add a rocket name '],
  },
  target: {
    type: String,
  },
  upcoming: {
    type: Boolean,
    required: [true, 'add a upcoming state '],
  },
  success: {
    type: Boolean,
    required: [true, 'Add a succes state'],
    default: true,
  },
  customers: [String],
});
// MONGO TURN IT INTO launches
module.exports = mongoose.model('launch', launchesSchema);
