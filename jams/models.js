'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const jamSchema = new mongoose.Schema({
	userHost: { type: String, required: true },
	jamDate: { type: String, required: true },
	jamTime: { type: String, required: true },
	style: { type: String, required: true },
	location: { type: String, required: true },

	}, { timestamp: true });

const Jam = mongoose.model('Jam', jamSchema);

module.exports = { Jam };