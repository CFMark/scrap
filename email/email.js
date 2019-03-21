require("dotenv").config();
const nodemailer = require("nodemailer");
const senderEmail = process.env.EMAIL;
const senderEmailPassword = process.env.EMAIL_PASSWORD;
const cheerio = require("cheerio");


const mailer = {
    sendReport: function(userEmail, data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: senderEmail,
                pass: senderEmailPassword
            }
        });
        // const $ = cheerio.load(data["<table id"]);
        // var string = "";
        // var data2 = $("body").html();
        // console.log(data2);

        const data3 = data["<table id"];
        //console.log(data["<table id"]);
        const mailOptions = {
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