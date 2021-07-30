const { Schema, model } = require('mongoose');

/**
 * An Answer schema
 */
const schema = new Schema({
  poll_id: { type: String, required: true, ref: 'Polls' },
  user_id: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  answer: { type: Number, requqired: true },
});

module.exports = model('Answer', schema);