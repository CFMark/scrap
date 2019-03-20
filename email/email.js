require("dotenv").config();
const nodemailer = require("nodemailer");
var senderEmail = process.env.EMAIL;
var senderEmailPassword = process.env.EMAIL_PASSWORD;
var cheerio = require("cheerio");


var mailer = {
    sendReport: function(userEmail, data) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: senderEmail,
                pass: senderEmailPassword
            }
        });
        var $ = cheerio.load(data["<table id"]);
        var string = "";
        var data2 = $("body").html();
        console.log(data2);
        var data3 = data["<table id"];
        //console.log(data["<table id"]);
        let mailOptions = {
            from: senderEmail,
            to: userEmail,
            subject: "Your Clearly Filtered Water Quality Assessment",
            //text: "Some Template",
            html: `<div>Your Test Results</div><div><table id=${data3}</table></div>`,
        };
        

        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        })
    },
}

module.exports = mailer;