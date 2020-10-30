# Authentication Login Applicaiton
A simple login application that comprises of a front-end, a back-end, and database (Firebase).

User enter their phone number and will get recived a verification code through text.

After recived the verify code, they enter it through the application and will get validate that the code is corrret or not.

## Tech/Framework used
front-end : [create-react-app](https://github.com/facebook/create-react-app).

back-end : [Express](https://www.npmjs.com/package/express).

database : [Firebase](https://firebase.google.com).

sms message text: [twillio](https://www.twilio.com).

## Installation
First, install the program require to run the application: [Node.js](https://nodejs.org/en/download/).

Then, clone this repository:

`git clone https://github.com/linhchi33a/authentication-react-express-app.git`

# back-end
Run the back-end by going the back-end directory:

`cd /authentication-react-express-app/backend`

After that, install node modules:
`npm install`

Create a .env file in to store the following info .env file. (If you need my .env file please contact me via email for information.)

`TWILIO_ACCOUNT_SID=your_account_sid`

`TWILIO_AUTH_TOKEN=your_auth_token`

`TWILIO_PHONE_NUMBER=your_twilio_phone_number`

Start the back-end environment with the following command:
`npm start`

The back-end should be running on [http://localhost:3001/](http://localhost:3001/).

# front-end
Run the back-end by going the back-end directory:

`cd /authentication-react-express-app/client/my-app`

After that, install node modules:
`npm install`


Start the application with the following command:
`npm start`

The front-end application should be running on [http://localhost:3000/](http://localhost:3000/).
