const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { env } = require("process");

const app = express();

// *** Body Parser ***
app.use(bodyParser.urlencoded({ extended: true }));

// *** Static Folder ***
app.use(express.static(__dirname + "/"));
// app.use("/public", express.static(path.join(__dirname, "public")));

// *** Tracking HTML File ***
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// *** Signup Route ***
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // *** Construct Requesting data ***
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // *** Stringify inputed data ***
  const jsonData = JSON.stringify(data);

  // *** url = "https://<data center>.api.mailchimp.com/3.0/lists/{listID}";
  const url = process.env.MAILCHIMP;

  const options = {
    method: "POST",
    auth: process.env.AUTHOR,
  };

  // *** Requesting and send back our data to mailchimp ***
  const request = https.request(url, options, function (response) {
    // *** Checking our code statment ***
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port: 3000");
});
