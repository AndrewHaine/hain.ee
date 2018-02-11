const mongoose = require('mongoose');
const { readFileSync } = require('fs');
const http = require('http');
const { createServer } = require('spdy');
const colors = require('colors');

// Environment vars
require('dotenv').config();

// SSL options
const options = {
  key: readFileSync(process.env.SSL_KEY),
  cert: readFileSync(process.env.SSL_CERT)
};

mongoose.connect(process.env.DB_HOST, {useMongoClient: true});
mongoose.promise = global.Promise;
mongoose.connection.on('error', (e) => console.log(`🚨 ${e.message} 🚨`));

require('./models/SavedLink');

const app = require('./app');

app.set('port', process.env.PORT || 3200);

createServer(options, app).listen(app.get('port'), () => {
    console.log(`${"[SECURE]: ".green}HTTPS app running on port: ${(app.get('port')).bold}`);

      // This is a non-secure http server that will catch any requests on the http port and redirect them to https
      http.createServer(app).listen(process.env.HTTP_PORT, () => console.log(`${"[INSECURE]: ".red}HTTP app running on port: ${(process.env.HTTP_PORT).bold}`));
});
