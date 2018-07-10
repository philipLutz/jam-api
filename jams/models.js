'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const jamSchema = new mongoose.Schema({
	userHost: { type: String, required: true },
	jamDate: { type: Date, required: true },
	jamTime: { type: String, required: true },
	style: { type: String, required: true },
	location: { type: String, required: true },
	instruments: { type: String, required: false },
	attendees: { type: Array }
	}, { timestamp: true });

const Jam = mongoose.model('Jam', jamSchema);

module.exports = { Jam };