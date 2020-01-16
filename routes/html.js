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
    const zipcode = req.params.zip;
    
    const request = {
        zipcode: zipcode,
        email: "",
        cookie: ""
    }

    db.Request.create(request)
    .then( resp => {
        console.log('CREATED');
        console.log(resp);
    })
    .catch( err => {
        console.log(err);
    });


    db.Zip.find({zip_id: zipcode})
    .then( resp => {
        console.log('FOUND');
        console.log(resp);
        // if(resp.length === 0){
            
        // }
        scrapeSystems();
    })
    .catch( err => {
        console.log(err);
    });


    function scrapeSystems(){
    axios.post(`https://www.ewg.org/tapwater/search-results.php?zip5=${zipcode}&searchtype=zip`)
    .then( (resp) => {
        console.log('RUNNING');
        const $ = cheerio.load(resp.data);
        const waterSystems = [];
        const results = $("table");
        
        results.each(function(i, element) {
            
            if(i === 0){
                $(element).find("tr").each(function(i, element) {
                    let row =  $(element);
                    
                    let waterSystem = {};

                    row.children().each(function(i, element) {
                        
                        let name = $(element).text();
                        let link =  $(element).find("a").attr("href");
                        
                        if ( i === 0) {
                            
                            waterSystem.name = name;
                            waterSystem.link = link;

                        } else if (i === 1) {
                            
                            waterSystem.city = name;
                            
                        } else {
                            waterSystem.pop = name;
                        }
                    });
                   

                    console.log('SYSTEM');
                    console.log(waterSystem);
                    waterSystems.push(waterSystem);

                });
            }
            
        });
        
        for(var i = 0; i < waterSystems.length; i++){
            if(i === 0){

            } else {
                let id = waterSystems[i].link.split("=")[1];
                waterSystems[i].id = id;
            }
            
        }
        console.log(waterSystems);
        db.Zip.create()
        res.send(waterSystems);

    })
    .catch( (err) => {
        console.log(err)
    })
    }
    


});

//ROUTE
router.post("/api/system/:id", (req, res) => {
    var systemId = req.params.id;
    var system = req.body;
    console.log('systemXXXXX');
    console.log(system);

    // db.WaterDistrict.find({sys_id: systemId})
    // .then( resp => {
    //     console.log(resp.length);
    //     if(resp.length === 0){
    //         scrape();
    //     }
        
    // })
    // .catch( err => {
    //     console.log(err);
    // })

    scrape();

    function scrape () {
    axios.get(`https://www.ewg.org/tapwater/system.php?pws=${systemId}`)
    .then( resp => {
        var $ = cheerio.load(resp.data);
        var systemInfo = {};
        var contamList = [];
        var contams = $(".contaminant-data");
        
        
        contams.each(function(i, element) {
            var contamInfo = {};
            
            contamInfo.contam_name = $(element).find(".contaminant-name").find("h3").text();
            contamInfo.local_level = $(element).find(".this-utility-ppb-popup").text();
            contamInfo.state_avg = $(element).find(".state-ppb-popup").text();
            contamInfo.nat_avg = $(element).find(".national-ppb-popup").text();
            
            healthGuide = $(element).find(".health-guideline-ppb").text();
            legalLimit = $(element).find(".legal-limit-ppb").text();

            if(healthGuide !== "") {
                contamInfo.limit_type = "Health Guideline";
                contamInfo.limit_level = healthGuide;
            } else if( legalLimit !== "") {
                contamInfo.limit_type = "Legal Limit";
                contamInfo.limit_level = legalLimit;
            }

            console.log(contamInfo);
            if(contamInfo.local_level === "" || contamInfo.limit_type === undefined){

            } else {
                contamList.push(contamInfo);
                
                

            }
            
        });

        systemInfo.sys_id = systemId;
        systemInfo.name = system.name;
        systemInfo.city = system.city;
        systemInfo.population = system.pop;
        system.lastUpdated = Date.now();
        systemInfo.local_contaminants = contamList;

        db.WaterDistrict.create(systemInfo)
        .then( resp => {
            console.log(resp);
        })
        .catch( err => {
            console.log(err);
        });

        res.send(contamList);

    })
    .catch( err => {
        console.log(err)
    })
}
scrape();
})

//ROUTE
router.post("/api/sendReport/:email", (req, res) => {
    var email = req.params.email;
    var data = req.body;

    console.log(email);
    
    mailer.sendReport(email, data);

    res.json("Email Sent");
});

module.exports = router;
