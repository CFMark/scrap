const express = require("express");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const exphbs = require("express-handlebars");
const htmlRoutes = require("./routes/html");

const PORT = process.env.PORT || 3000; 
const app = express();

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/tapWaterReport';

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.connect(dbURL);

app.use(express.static("public"));
app.use(htmlRoutes);

app.listen(PORT, function(){
    console.log(`Server now listening on port: ${PORT}`);
});