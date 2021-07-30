const { Schema, model } = require('mongoose');

/**
 * An empty schema, we need just to store unique ids
 */
const schema = new Schema({
    name: { type: String },
});

module.exports = model('User', schema);