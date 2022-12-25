const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const e = require('express');




// var new_tasks = ['cook', 'eat', 'sleep'];
var work_tasks = [];


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var today = new Date();


var options = {
    weekday: 'long',
    day: "numeric",
    month: "long",
};

var day = today.toLocaleDateString("en-US", options);


mongoose.connect('mongodb+srv://lonely:12345@cluster0.wk0dk.mongodb.net/items', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully connected...");
    }
})

const itemSchema = ({
    title: {
        type: 'string',
        required: [true]
    }
});

const listSchema = {

    name: String,
    items: [itemSchema]

}

const List = mongoose.model('List', listSchema);


const ListItems = mongoose.model('ListItem', itemSchema);

const WorkListItems = mongoose.model('WorkListItem', itemSchema);

const listitem1 = new ListItems({
    title: "welcome to your TODO list!"
});

const listitem2 = new ListItems({
    title: "Hit the + button to add a new item"
});

const listitem3 = new ListItems({
    title: "Hit this to delete an item"
});

const defaultItem = [listitem1, listitem2, listitem3];





app.get('/', (req, res) => {

   


    ListItems.find(function (err, contents) {





        res.render('list', {
            listTitle: day,
            newTasks: contents
        });





    })







    //-----------------------------------------------------
});

app.post('/', (req, res) => {

    var options = {
        weekday: 'long',
        day: "numeric",
        month: "long",
    };
    
    var day = today.toLocaleDateString("en-US", options);

        var new_task = req.body.newTask;

        var UrL = req.body.list;
       
        const listitemn = new ListItems({
            title: new_task
        });

        if(UrL === day){
            listitemn.save();
            res.redirect("/");
        }else{
            List.findOne({name: UrL}, function (err, foundList){
                foundList.items.push(listitemn);
                foundList.save();
                res.redirect("/" + UrL);
            })
        }
    


});

app.post('/delete', (req, res) => {

    var status = req.body.checkBox;

    console.log(status);

    ListItems.findByIdAndRemove(status, function (err) {

        if (!err) {
            console.log("Successfully deleted!");
            res.redirect('/');
        } else {
            res.redirect('/');
        }



    });


});


app.get("/:url", (req, res) => {
    var URL = req.params.url


    List.findOne({ name: URL }, function (err, foundList) {

        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: URL,
                    items: defaultItem

                })

                list.save();
                res.redirect("/" + URL);
            } else {
                res.render("list", {
                    listTitle: foundList.name,
                    newTasks: foundList.items

                })
            }
        }

    });



})

app.post('/work', (req, res) => {

    var work_task = req.body.newTask;
    work_tasks.push(work_task);
    res.redirect("/work");

});

app.get('/about', (req, res) => {

    res.render('about');

});


app.listen(5001, (req, res) => {

    console.log("listening to port 5001...");

});