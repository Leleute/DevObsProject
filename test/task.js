var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var admin = require("firebase-admin");
const config = require('../config/test.json');
var should = chai.should();

const uuid = require('uuid');
const { assert } = require('chai')
const requestRetry = require('requestretry');
const BASE_URL = `http://localhost:8080`;
chai.use(chaiHttp);



beforeEach(function() {
    try {
        firebaseServer = admin.initializeApp({
            credential: admin.credential.cert(require("." + config.serviceAccount)),
            databaseURL: config.DBHost
        }, 'test');
        assert.notStrictEqual(firebaseServer, null);
        firebaseServer.delete();
    } catch (FirebaseAppError) {
        assert.notStrictEqual(firebaseServer, null);
    }
});


describe('Test connection to database Firebase with INCORRECT parameters', function() {
    it('it should NOT connect to Database Firebase', async() => {
        try {
            var firebaseServerCorrupted = admin.initializeApp({
                credential: "admin.credential.cert(require(config.serviceAccount))",
                databaseURL: "http://lol"
            }, 'test');
            assert.strictEqual(firebaseServerCorrupted, undefined);
            firebaseServerCorrupted.delete();
        } catch (FirebaseAppError) {
            console.log();
            assert.strictEqual(firebaseServerCorrupted, undefined);
        }
    });
});


describe('Test of returning content of page after connection', function() {
    it('it should return a HTML page', async() => {
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
});

describe('Test of adding a new task in TodoList after connection', function() {
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
});

describe('Test of deleting a task in TodoList after connection', function() {
    it('it should DELETE a task', (done) => {
        let id = '-LuX8ixJziFR_uf-OYU1';
        chai.request(server)
            .get('/todolist/delete/' + id)
            .end((err, res) => {
                res.body.should.a('string');
                res.body.should.equal('Deleted');
                done();
            });
    });
});

describe('Test of disconnecting from the Firebase database after connection', function() {
    var firebaseServer = undefined;
    it('it should CONNECT to Database Firebase', async() => {
        try {
            firebaseServer = admin.initializeApp({
                credential: admin.credential.cert(require("." + config.serviceAccount)),
                databaseURL: config.DBHost
            }, 'test');
            assert.notStrictEqual(firebaseServer, null);

        } catch (FirebaseAppError) {
            assert.notStrictEqual(firebaseServer, null);
        }
    });
    it('it should DISCONNECT to Database Firebase', async() => {
        firebaseServer.database().goOffline();
        const connected = false;

        firebaseServer.database().ref().child('.info/connected').on('value', function(connectedSnap) {
            if (connectedSnap.val() === true) {
                /* we're connected! */
                assert.strictEqual(connected, true);
            } else {
                /* we're disconnected! */
                assert.strictEqual(connected, false);
            }
        });
        firebaseServer.delete();
    });

});