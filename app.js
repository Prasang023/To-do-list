//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-prasang:test123@cluster0.6dkwq.mongodb.net/tododb", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome"
});

const item2 = new Item({
  name: "Hit + button to add new item"
});

const item3 = new Item({
  name: "<-- Hit to delete item"
});

const defaulti = [item1, item2, item3];



app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaulti, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved");
        }
      });
      res.redirect('/');
    }else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});  
    }
  })

  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect('/');

});

app.post("/delete", function(req, res){
  const itemid = req.body.check;

  Item.findByIdAndRemove(itemid, function(err){
    if(!err){
      res.redirect('/');
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
