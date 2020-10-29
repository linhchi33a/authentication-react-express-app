var express = require('express');
var router = express.Router();

const path = require('path')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


const app = express();
// a test route to make sure we can reach the backend
//this would normally go in a routes file
app.get('/test', (req, res) => {
res.send('Welcome to the backend!')
})

module.exports = router;
