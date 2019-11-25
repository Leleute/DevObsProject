function getTasks(req, res) {
    var db = require('../server').firebase;
    //Query the DB and if no errors, send all the books
    db.orderByKey().once("value").then(function(snapshot) {
        res.render('todolist.ejs', { todolist: snapshot });
    });
}

function postTask(req, res) {
    var db = require('../server').firebase;
    var sType = typeof(require('../server').serverType);
    if (req.body.newtask != '') {
        if (req.body.colorInput != undefined) {
            task = { name: req.body.newtask, color: req.body.colorInput };
        } else {
            task = { name: req.body.newtask };
        }
        db.push().set(task);
        if (sType !== 'undefined') {
            res.redirect('/todolist');
        } else {
            res.json("Added");
        }
    }
}

function deleteTask(req, res) {
    var db = require('../server').firebase;
    var sType = typeof(require('../server').serverType);

    if (req.params.id != '') {
        db.child(req.params.id).remove()
        if (sType !== 'undefined') {
            res.redirect('/todolist');
        } else {
            res.json("Deleted");
        }


    }
}

module.exports = { getTasks, postTask, deleteTask };