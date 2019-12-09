const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = ["Code","Guitar", "Music"]; //items on the to do list


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

    let day = todayDate.toLocaleDateString("en-US",options);
    res.render("list", {
        day: day,
        items: items
    })
});

app.post("/", (req, res) => {
    items.push(req.body.newItem);
    res.redirect("/");
});
app.listen(3000, () => {
    console.log("Server Started....");
});