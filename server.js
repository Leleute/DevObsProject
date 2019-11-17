let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let port = 8080;
let task = require('./routes/task');
var admin = require("firebase-admin");
var favicon = require('serve-favicon');
let config = '';

if (typeof (process.env.NODE_ENV) !== 'undefined') {
    config = require('./config/dev.json'); //we load the db location from the JSON files
} else {
    config = require('./config/test.json'); //we load the db location from the JSON files
}
credentialCertificate = require(config.serviceAccount);
console.log(config.serviceAccount);
console.log(config.DBHost);
//db connection 
var firebase = admin.initializeApp({
    credential: admin.credential.cert(credentialCertificate),
    databaseURL: config.DBHost
}, 'app');
var tasksDataRef = firebase.database().ref('tasks');

app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(express.static(__dirname + '../public'));

//parse application/json and look for raw text                                       
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.route("/todolist")
    .get(task.getTasks)
app.route("/todolist/add")
    .post(task.postTask)
app.route("/todolist/delete/:id")
    .get(task.deleteTask)

app.get('*', function (req, res) {
    res.redirect('/todolist');
});

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing
module.exports.firebaseServer = firebase;
module.exports.firebase = tasksDataRef;
module.exports.serverType = process.env.NODE_ENV;
