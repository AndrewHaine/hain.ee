const mongoose = require('mongoose');
const fs = require('fs');
const http = require('http');
const https = require('https');
const colors = require('colors');

// Environment vars
require('dotenv').config();

// SSL options
const options = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT)
};

mongoose.connect(process.env.DB_HOST, {useMongoClient: true});
mongoose.promise = global.Promise;
mongoose.connection.on('error', (e) => console.log(`🚨 ${e.message} 🚨`));

require('./models/SavedLink');

const app = require('./app');

app.set('port', process.env.PORT || 3200);

// This is the ssl-enabled server that will receive all requests
https.createServer(options, app).listen(app.get('port'), () => {
  console.log(`${"[SECURE]: ".green}HTTPS app running on port: ${(process.env.PORT).bold}`);

  // This is a non-secure http server that will catch any requests on the http port and redirect them to https
  http.createServer(app).listen(process.env.HTTP_PORT, () => console.log(`${"[INSECURE]: ".red}HTTP app running on port: ${(process.env.HTTP_PORT).bold}`));
});
