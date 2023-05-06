const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: [true, 'Add a Planet Name '],
  },
});

module.exports = mongoose.model('planet', planetSchema);
