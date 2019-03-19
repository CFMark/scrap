var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");


router.get("/", (req, res) => {
    res.render("index");

});

router.post("/api/:zip", (req, res) => {
    var zip = req.params.zip;
    
    axios.post(`https://www.ewg.org/tapwater/search-results.php?zip5=${zip}&searchtype=zip`)
    .then( (resp) => {
        
        var $ = cheerio.load(resp.data);
        var waterSystems = [];
        var results = $("table");
        results.each(function(i, element) {
            
            if(i === 1){
                $(element).find("tr").each(function(i, element) {
                    var row =  $(element);
                    var waterSystem = {};

                    row.children().each(function(i, element) {
                        var datum = $(element).html();
                        var name = $(element).text();
                        var link = $(element).find("a").attr("href");
                        if ( i === 0) {
                            waterSystem.name = name;
                            waterSystem.link = link;
                        } else if (i === 1) {
                            waterSystem.city = name;
                            
                        } else {
                            waterSystem.pop = name;
                        }
                    });
                    console.log(waterSystem);
                    waterSystems.push(waterSystem);

                });
            }
            
        });
        res.send(waterSystems);

    })
    .catch( (err) => {
        console.log(err)
    })


})

module.exports = router;