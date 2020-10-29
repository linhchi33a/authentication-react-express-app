var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var app = express();
var cors = require('cors');
var admin = require("firebase-admin");

var serviceAccount = require(path.join(__dirname,'serviceAccountKey.json'));
var sendSms = require("./twilio");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("saving-data/");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://phonenumber-accesscode.firebaseio.com"
});
app.use(bodyParser.json({limit: '10240kb'}));
app.use(cors());

//function that give a random number with AClen digit
function randomNumber(AClen){
  var result='';
  for (var i = 0; i < AClen; i++) {
    var num = Math.floor(Math.random() * 10);
    var numstring=num.toString();
    result=result.concat(numstring);
  }
  return result;
}

var PNAC = db.ref(`PhoneNumber/`);

//POST ACCESSCODE
app.post('/AccessCode', async (req, res) => {

    const phoneNumber= req.body['phoneNumber'];
    const verifyMessage = `Your verification code is ${AccessCode_generate}`;
    var AccessCode_generate = randomNumber(6);
    var db_object = {};

    console.log(`recived a request to create a new AccessCode for number ${phoneNumber}`);
    //Puttting phonenumber and accesscode to the database
    db_object[phoneNumber] = AccessCode_generate
    PNAC.update(db_object, () => {
      console.log(`added phonenumber: ${phoneNumber} paired AccessCode: ${AccessCode_generate} to the Database`);
    });
    //sending message to phonenumber
    sendSms(phoneNumber, verifyMessage);
    //return the AccessCode
    return res.status(200).send(AccessCode_generate);
});

//Retriving Data
var lastestDataSnapshot = {};
lastestDataSnapshot = PNAC.on("value", (snapshot) => {
  for (const k in snapshot.val()){
    lastestDataSnapshot[k] = snapshot.val()[k]
  }
});


//POST VALIDATION
app.post('/AccessCodeValidation', async (req, res, next) => {
  const phoneNumber= req.body["phoneNumber"];
  const AccessCode = req.body["AccessCode"];
  console.log(`recived a request to Validate phone Number ${phoneNumber} with AccessCode ${AccessCode}`);
  //MATCHING THE ACCESSCODE IN DATABASE TO THE PROVIDED ACESSCODE 
  if((lastestDataSnapshot[phoneNumber] == AccessCode)){
    validation = JSON.stringify({"Success":true})
    console.log(`Validation success for phone number ${phoneNumber}`);
    //UPDATE ACCESSCODE TO EMPTY STRING IF SUCCESS IS TRUE
    var db_object = {};
    db_object[phoneNumber] = '';
    PNAC.update(db_object, () => {
      console.log(`Update Access Code to empty string for Phone Number ${phoneNumber}`);
    });
  }
  else{
    validation = JSON.stringify({"Success":false})
    console.log(`Failed to validate Phone Number ${phoneNumber}`);
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
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;