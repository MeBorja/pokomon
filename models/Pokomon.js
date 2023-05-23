const { Schema, model } = require('mongoose');

const pokomonSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  pokomonName :  {
    type: String,
    required: [true, 'Please enter a pokomon name'],
    unique: true,
    minlength: [3, 'Minimum pokomon length is 3 characters'],
  },
  ability1: {
    type: String,
    default: 'Unknown',

  },
  ability2: {
    type: String,
    default: 'Unknown',


  },
  ability3: {
    type: String,
    default: 'Unknown',

  },

  
});
const Pokomon = model('pokomon', pokomonSchema)

module.exports = Pokomon