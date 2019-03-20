var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var mailer = require("../email/email");


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
                    //console.log(waterSystem);
                    waterSystems.push(waterSystem);

                });
            }
            
        });
        res.send(waterSystems);

    })
    .catch( (err) => {
        console.log(err)
    })


});

router.post("/api/system/:id", (req, res) => {
    var systemId = req.params.id;
    console.log(systemId);
    axios.get(`https://www.ewg.org/tapwater/system.php?pws=${systemId}`)
    .then( resp => {
        var $ = cheerio.load(resp.data);
        var contamList = [];
        var contams = $("#contams_above_hbl").find(".contaminant-data");
        //console.log(contams);
        contams.each(function(i, element) {
            var contamInfo = {};
            //var entirecontam = $(element).html();
            //CONTAMINANT NAME
            contamInfo.name = $(element).find(".contaminant-name").find("h3").text();

            contamInfo.yourLevel = $(element).find(".this-utility-ppb-popup").text();
            contamInfo.healthGuide = $(element).find(".health-guideline-ppb").text();
            console.log(contamInfo);
            if(contamInfo.yourLevel === "" || contamInfo.healthGuide === ""){

            } else {
                contamList.push(contamInfo);
            }
            
            //this-utility-ppb-popup
            //health-guideline-ppb

            
        });
        res.send(contamList)

        
    })
    .catch( err => {
        console.log(err)
    })
})

router.post("/api/sendReport/:email", (req, res) => {
    var email = req.params.email;
    var data = req.body;

    console.log(email);
    console.log(req.body);
    mailer.sendReport(email, data);

    res.json("Email Sent");
});

module.exports = router;