var express = require("express");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");
var exphbs = require("express-handlebars");
var htmlRoutes = require("./routes/html");

var PORT = process.env.PORT || 3000; 
var app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static("public"));
app.use(htmlRoutes);

app.listen(PORT, function(){
    console.log(`Server now listening on port: ${PORT}`);
});