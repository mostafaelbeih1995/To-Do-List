const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const Item = require("./models/item");
// const List = require("./models/itemList");
const app = express();
var day;

///////         Schemas
const itemSchema = mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);
/////////////////////////

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
    let todayDate = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    day = todayDate.toLocaleDateString("en-US", options);
    Item.find((err, databaseItems) => {
        if (err) {
            console.log("Error retreiving from database");
        }
        else {
            console.log(databaseItems);
            res.render("list", {
                day: day,
                items: databaseItems
            });
        }
    })
});

app.get("/:customListName", (req,res) => {
    const customLinkName = req.params.customListName;

    List.findOne({ name: customLinkName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                console.log("Did not find existing list");
                //create a new list
                const list = new List({
                    name: customLinkName
                    // items: [new Item({name: "Suck a dick"})]
                });
                list.save();
                res.redirect("/" + customLinkName);
                console.log("Does not exist");
            }
            else {
                console.log("Found existing list");
                //show an existing list
                res.render("list", {
                    day: customLinkName,
                    items: foundList.items
                });
                console.log("Exist");
            }
        }
    })
});
app.post("/delete", (req, res) => {
    const clickedItem = req.body.clicked;
    console.log(clickedItem);
    Item.findByIdAndRemove(clickedItem, (err) => {
        if (!err) {
            console.log("Deleted successfully");
        }
        else {
            console.log("Trouble deleting from database");
        }
        res.redirect("/");
    });
});
app.post("/", (req, res) => {
    const newItem = new Item({ name: req.body.newItem });
    const listName = req.body.list;

    if (listName === day) {
        newItem.save().then(() => {
            res.redirect("/");
        });    
    }
    else {
        List.findOne({ name: listName }, (err, foundList) => {
            if (!err) {
                foundList.items.push(newItem);
                foundList.save().then(() => {
                    res.redirect("/" + listName);   
                });
            }
        });
    }
    
});
app.listen(3000, () => {
    console.log("Server Started....");
});

mongoose.connect("mongodb+srv://mostafaelbeih:Kendrick_lamar_222@cluster0-erbgg.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
    console.log("Connected to database successfully");
    })
    .catch(() => {
    console.log("Failed to connect to database");
    });



