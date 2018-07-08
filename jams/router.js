'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const passport = require('passport');

mongoose.Promise = global.Promise;

const jwtAuth = passport.authenticate('jwt', {session: false});

router.use(jwtAuth)

router.use(bodyParser.json())

const {Jam} = require('./models');
const {User} = require('../users/models');

// GET all jams that are happening that day or in the future.

router.get('/', jwtAuth, (req, res) => {
	const currentDate = Date.now();
	currentDate.setHours(0,0,0,0);
	Jam
		.find({jamDate: {$gte: currentDate}})
		.sort({jamDate: -1})
		.then(jams => res.json(jams))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error, unable to find jams.'});
		});
});

// GET a specific jam by _id.

router.get('/:id', jwtAuth, (req, res) => {
	Jam
		.findById(req.params.id)
		.then(jam => res.json(jam))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error, unable to find jam.'});
		});
});

// GET all jams that a user has been to or going to.

router.get('/:username', jwtAuth, (req, res) => {

})

// GET all jams that a user has created.

router.get('/:userHost', jwtAuth, (req, res) => {

})

// POST create a jam.

router.post('/', jwtAuth, (req, res) => {
	console.log(req.user);
	Jam
		.create({
			
		})
})

// PUT userHost changes information about a jam.

// PUT attendee plans to go to a jam.

// DELETE a jam from happening.

// DELETE user from a jam (attendee isn't going to show up).