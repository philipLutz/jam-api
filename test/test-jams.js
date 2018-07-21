'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { Jam } = require('../jams/models');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/jams', function() {
	const username = 'exampleUser';
  	const password = 'examplePass';
  	const firstName = 'Example';
  	const lastName = 'User';
  	const email = 'exampleEmail@gmail.com';
  	const bio = 'exampleBio';
  	const userHost = 'exampleUserHost';
	const jamDate = Date.now();
	const jamTime = '8:30PM';
	const style = 'Dad rock';
	const location = 'my apartment';
	const instruments = 'guitar, bass, drums, screaming vocals';
	const attendees = ['exampleUserHost','me','you','them'];

	before(function () {
    	return runServer(TEST_DATABASE_URL);
  	});

  	after(function () {
    	return closeServer();
  	});

  	beforeEach(function () {
  		return User.hashPassword(password).then(password =>
      		User.create({
        		username,
        		password,
        		firstName,
        		lastName,
        		email,
        		bio
      		})).then(function() {
      		Jam.create({
      			userHost,
      			jamDate,
      			jamTime,
      			style,
      			location,
      			instruments,
      			attendees
      		})
    	});
  	});

  	afterEach(function () {
   		return User.remove({}).then(function() {
   			return Jam.remove({})
   		});
  	});

  	describe('/api/jams', function() {
  		describe('GET', function() {
  			it('Should list all the jams occurring now or in the future', function() {
  				const token = jwt.sign({user: {username: 'exampleUserName'}}, JWT_SECRET, {expiresIn: 10000});
        		return chai
        			.request(app)
        			.get('/api/jams')
          			.set('Authorization', `Bearer ${token}`)
          			.then(function(res) {
          				expect(res).to.have.status(200);
          				expect(res).to.be.json;
          				expect(res.body).to.be.an('array');
          			});
  			});
  			// it('Should get a specific jam by id', function() {
  			// 	const token = jwt.sign({user: {username: 'exampleUserName'}}, JWT_SECRET, {expiresIn: 10000});
  			// 	let jamToFind;
  			// 	return Jam
  			// 		.findOne()
  			// 		.then(function(res) {
  			// 			jamToFind = res._id;
  			// 			return chai.request(app)
  			// 				.get(`/api/jams/${jamToFind}`)
  			// 				.set('Authorization', `Bearer ${token}`)
  			// 		})
  			// 		.then(function(res) {
  			// 			expect(res).to.have.status(200);
  			// 			expect(res).to.be.json;
  			// 		});
  			// });
        // it('Should get all jams for a specific user', function() {
        //   const token = jwt.sign({user: {username: 'exampleUserName'}}, JWT_SECRET, {expiresIn: 10000});
        //   const username = 'exampleUserName';
        //    return chai
        //     .request(app)
        //     .get(`/api/jams/${username}`)
        //       .set('Authorization', `Bearer ${token}`)
        //       .then(function(res) {
        //         expect(res).to.have.status(200);
        //         expect(res).to.be.json;
        //         expect(res.attendees).to.include("exampleUserName");
        //       });
        // });
  		});

  		describe('POST', function() {
  			it('Should add a jam', function() {
  				const token = jwt.sign({user: {username: 'exampleUserName'}}, JWT_SECRET, {expiresIn: 10000});
  				const jamBody = {userHost, jamDate, jamTime, style, location, instruments, attendees};
  				return chai
  					.request(app)
  					.post('/api/jams')
  					.send(jamBody)
  					.set('Authorization', `Bearer ${token}`)
  					.then(function(res) {
  						expect(res).to.have.status(201);
  						expect(res).to.be.json;
  						expect(res.body.style).to.equal(jamBody.style);
  						console.log(res.body.attendees);
  					});
  			});
  		});

  		describe('PUT', function() {
  			it('Should edit a jam', function() {
  				const token = jwt.sign({user: {username: 'exampleUserName'}}, JWT_SECRET, {expiresIn: 10000});
  				const updateJam = {
  					userHost: userHost,
  					jamDate: jamDate,
  					jamTime: jamTime,
  					style: "funky bluegrass",
  					location: location,
  					instruments: instruments,
  					attendees: "Nico"
  				}
  				console.log(updateJam.attendees);
  				return Jam
  					.findOne()
  					.then(function(res) {
  						updateJam._id = res._id;
  						return chai.request(app)
  							.put(`/api/jams/${res._id}`)
  							.set('Authorization', `Bearer ${token}`)
  							.send(updateJam)
  					})
  					.then(function(res) {
  						expect(res).to.have.status(201);
  						expect(res).to.be.json;
  						return Jam.findById(updateJam._id)
  					})
  					.then(function(res) {
  						expect(res.style).to.equal(updateJam.style);
  						expect(res.attendees).to.include("Nico");
  						console.log(res.attendees);
  						console.log(res.style);
  					});
  			});
  		});

  		describe('DELETE', function() {
  			it('Should delete an existing jam', function() {
  				const token = jwt.sign({user: {username: 'exampleUserName'}}, JWT_SECRET, {expiresIn: 10000});
  				let jamToDelete;
  				return Jam
  					.findOne()
  					.then(function(res) {
  						jamToDelete = res._id;
  						return chai.request(app)
  							.delete(`/api/jams/${jamToDelete}`)
  							.set('Authorization', `Bearer ${token}`)
  					})
  					.then(function(res) {
  						expect(res).to.have.status(204);
  						return Jam.findById(jamToDelete)
  					})
  					.then(function(res) {
  						expect(res).to.not.exist;
  					});
  			});
  		});
  	});
});