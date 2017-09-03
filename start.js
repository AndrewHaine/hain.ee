const mongoose = require('mongoose');
const app = require('./app');

// Environment vars
require('dotenv').config();

// DB models
require('./models/SavedURL');

mongoose.connect(process.env.DB_HOST, {useMongoClient: true});
mongoose.promise = global.Promise;
mongoose.connection.on('error', (e) => console.log(`🚨 ${e.message} 🚨`));

app.set('port', process.env.PORT || 3200);
const server = app.listen(app.get('port'), () => console.log(`App running on port ${server.address().port}`));
