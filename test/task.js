var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var db = require('../server').firebase;
var firebaseServer = require('../server').firebaseServer;
var should = chai.should();

const uuid = require('uuid');
const { assert } = require('chai')
const requestRetry = require('requestretry');
const BASE_URL = `http://localhost:8080`;
chai.use(chaiHttp);



it('it should test server connection', async () => {
  assert.notEqual(db, null);
  db.orderByKey().once("value").then(function (snapshot) {
    assert.notEqual(snapshot, null);
    snapshot.forEach(function (childSnapshot) {
      assert.notEqual(childSnapshot, null);
    });
  });
});



it('it should open the server connection', async () => {
  const name = uuid.v4();
  const response = await requestRetry({
    url: `${BASE_URL}/todolist`,
    method: 'GET',
    body: { name },
    retryDelay: 200,
    json: true,
  });
  assert.include(response.body, '<!DOCTYPE html>', 'Contains the HTML script');
});



it('it should return a HTML page', async () => {
  const name = uuid.v4();
  const response = await requestRetry({
    url: `${BASE_URL}/todolist`,
    method: 'GET',
    body: { name },
    retryDelay: 200,
    json: true,
  });
  assert.include(response.body, '<!DOCTYPE html>', 'Contains the HTML script');
});

it('it should ADD a task ', (done) => {
  let add = {
    newtask: "New row test"
  }
  chai.request(server)
    .post('/todolist/add')
    .send(add)
    .end((err, res) => {
      console.log(res.body);
      res.body.should.a('string');
      res.body.should.equal('Added');
      done();
    });
});


it('it should DELETE a task', (done) => {
  let id = '-LtuG0ydxNinnEc4jhss';
  chai.request(server)
    .get('/todolist/delete/' + id)
    .end((err, res) => {
      console.log(res.body);
      res.body.should.a('string');
      res.body.should.equal('Deleted');
      done();
    });
});
it('it should close the server', (done) => {
  after(function () {
    firebaseServer.database().goOffline();
  });
  done();
});

