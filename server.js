const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const shortUrlRoute = require(__dirname + '/routes/shortUrlRoute');
const indexRoute = require(__dirname + '/routes/index');
const notFoundHandler = require(__dirname + '/middleware/notFoundHandler');
const errorHandler = require(__dirname + '/middleware/errorHandler');
const cors = require('cors');


app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/api/shorturl', shortUrlRoute);
app.use('/', indexRoute);
app.use(notFoundHandler);
app.use(errorHandler);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
