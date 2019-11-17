function getTasks(req, res) {
    var db = require('../server').firebase;
    //Query the DB and if no errors, send all the books
    db.orderByKey().once("value").then(function (snapshot) {
        res.render('todolist.ejs', { todolist: snapshot });
    });
}

function postTask(req, res) {
    var db = require('../server').firebase;
    var sType = typeof(require('../server').serverType);

    console.log(req.body);
    if (req.body.newtask != '') {
        task = { name: req.body.newtask };
        db.push().set(task);
        if(sType !== 'undefined') {
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
        console.log(req.params.id);
        if(sType !== 'undefined') {
            res.redirect('/todolist');
        } else {
            res.json("Deleted");
        }
        
        
    }
}

module.exports = { getTasks, postTask, deleteTask };
