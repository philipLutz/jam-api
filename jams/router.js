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

// GET all jams that a user has created.

router.get('/:userHost', jwtAuth, (req, res) => {
	Jam
		.find({user: req.user.username})
		.find({userHost: req.params.userHost})
		.sort({jamDate: 1})
		.then(jams => res.json(jams))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error, unable to find jams'});
		});
});

// POST create a jam.

router.post('/', jwtAuth, (req, res) => {
	console.log(req.user);
	Jam
		.create({
			userHost: req.user.username,
			jamDate: req.body.jamDate,
			jamTime: req.body.jamTime,
			style: req.body.style,
			location: req.body.location,
			instruments: req.body.instruments
		})
		.then(jam => res.status(201).json(jam))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error, unable to post workout.'});
		});
});

// PUT userHost changes information about a jam.

router.put('/:id', jwtAuth, (req, res) => {
	Jam
		.findByIdAndUpdate(req.params.id, {$set: {
			jamDate: `${req.body.jamDate}`,
			jamTime: `${req.body.jamTime}`,
			style: `${req.body.style}`,
			location: `${req.body.location}`,
			instruments: `${req.body.instruments}`
		}})
		.then(updatedJam => res.status(201).json(updatedJam))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error, unable to edit jam.'});
		});
});

// DELETE a jam from happening.

router.delete('/:id', jwtAuth, (req, res) => {
	Jam
		.findbyIdAndRemove(req.params.id)
		.then(jam => {
			console.log(`Deleted jam with id \`${req.params.id}\``);
			res.status(204).json({message: 'success'});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error, unable to delete jam.'});
		});
});

module.exports = { router };




