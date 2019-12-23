const express = require("express");
const bodyParser = require("body-parser");
const Item = require("./models/item");
const app = express();
const mongoose = require("mongoose");



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

    let day = todayDate.toLocaleDateString("en-US", options);
    Item.find((err, databaseItems) => {
        if (err) {
            console.log("Error retreiving from database")
        }
        else {
            console.log(databaseItems);
            res.render("list", {
                day: day,
                items: databaseItems
            })
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
    newItem.save().then(() => {
        res.redirect("/");
    });
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



