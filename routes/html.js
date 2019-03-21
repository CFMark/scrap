const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const mailer = require("../email/email");
const db = require("../models");


router.get("/", (req, res) => {
    res.render("index");

});

router.post("/api/:zip", (req, res) => {
    const zip = req.params.zip;
    
    const request = {
        zipcode: zip,
        email: "",
        cookie: ""
    }

    db.Request.create(request)
    .then( resp => {
        console.log(resp);
    })
    .catch( err => {
        console.log(err);
    })

    axios.post(`https://www.ewg.org/tapwater/search-results.php?zip5=${zip}&searchtype=zip`)
    .then( (resp) => {
        
        const $ = cheerio.load(resp.data);
        const waterSystems = [];
        const results = $("table");
        results.each(function(i, element) {
            
            if(i === 1){
                $(element).find("tr").each(function(i, element) {
                    let row =  $(element);
                    let waterSystem = {};

                    row.children().each(function(i, element) {
                        //var datum = $(element).html();
                        let name = $(element).text();
                        let link = $(element).find("a").attr("href");
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
    //console.log(req.body);
    mailer.sendReport(email, data);

    res.json("Email Sent");
});

module.exports = router;