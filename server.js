const express = require('express');
const bodyParser = require('body-parser');
const task = require('./routes/task');
const admin = require("firebase-admin");
const favicon = require('express-favicon');
const $ = require("jquery");

var config = '';

const port = 8080;
const app = express();

if (typeof(process.env.NODE_ENV) !== 'undefined') {
    config = require('./config/dev.json'); //we load the db location from the JSON files
} else {
    config = require('./config/test.json'); //we load the db location from the JSON files
}
credentialCertificate = require(config.serviceAccount);
console.log(config.serviceAccount);
console.log(config.DBHost);

var firebase = admin.initializeApp({
    credential: admin.credential.cert(credentialCertificate),
    databaseURL: config.DBHost
}, 'app');
var tasksDataRef = firebase.database().ref('tasks');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.route("/todolist")
    .get(task.getTasks)
app.route("/todolist/add")
    .post(task.postTask)
app.route("/todolist/delete/:id")
    .get(task.deleteTask)

app.get('*', function(req, res) {
    res.redirect('/todolist');
});

app.listen(port);
console.log("Listening on port " + port);

module.exports = app;
module.exports.firebaseServer = firebase;
module.exports.firebase = tasksDataRef;
module.exports.serverType = process.env.NODE_ENV;