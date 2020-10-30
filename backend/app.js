var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var firebaseAdmin = require("firebase-admin");
var dbCredential = require(path.join(__dirname, "serviceAccountKey.json"));
var sendSms = require("./twilio");

var app = express();
var cors = require("cors");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(dbCredential),
  databaseURL: "https://phonenumber-accesscode.firebaseio.com",
});
// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = firebaseAdmin.database();
var phoneCodeRef = db.ref(`PhoneNumber/`);

app.use(bodyParser.json({ limit: "10240kb" }));
app.use(cors());

//function that give a random numeric string with len digit
function randomNumber(len) {
  var result = "";
  for (var i = 0; i < len; i++) {
    var num = Math.floor(Math.random() * 10);
    var numstring = num.toString();
    result = result.concat(numstring);
  }
  return result;
}

//POST ACCESSCODE
app.post("/accessCode", async (req, res) => {
  var generatedAcesscode = randomNumber(6);
  const verifyMessage = `Your verification code is ${generatedAcesscode}`;
  const phoneNumber = req.body["phoneNumber"];
  var phoneCodeObject = {};
  console.log(`Recieved a request to create a new Access Code for number ${phoneNumber}`);
  //Puttting phonenumber and accesscode to the database
  phoneCodeObject[phoneNumber] = generatedAcesscode;
  phoneCodeRef.update(phoneCodeObject, () => {
    console.log(
      `Added phonenumber: ${phoneNumber} paired Access Code: ${generatedAcesscode} to the Database`
    );
  });
  //sending message to phonenumber
  sendSms(phoneNumber, verifyMessage);
  //return the accessCode
  return res.status(200).send(generatedAcesscode);
});

//Retrieving Data
var lastestDataSnapshot = {};
phoneCodeRef.on("value", (snapshot) => {
  for (const key in snapshot.val()) {
    lastestDataSnapshot[key] = snapshot.val()[key];
  }
});

//POST VALIDATION
app.post("/accessCodeValidation", async (req, res) => {
  const phoneNumber = req.body["phoneNumber"];
  const accessCode = req.body["accessCode"];
  console.log(
    `Recieved a request to Validate phone Number ${phoneNumber} with accessCode ${accessCode}`
  );
  //Matching the accesscode in database to the provided accesscode
  if (lastestDataSnapshot[phoneNumber] == accessCode) {
    validation = JSON.stringify({ success: true });
    console.log(`Succeeded to validate phone number ${phoneNumber}`);
    //Update accesscode to empty string if success is true
    var phoneCodeObject = {};
    phoneCodeObject[phoneNumber] = "";
    phoneCodeRef.update(phoneCodeObject, () => {
      console.log(
        `Updated access code to empty string for phone number ${phoneNumber}`
      );
    });
  } else {
    validation = JSON.stringify({ success: false });
    console.log(`Failed to validate phone number ${phoneNumber}`);
  }
  return res.status(200).send(validation);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
