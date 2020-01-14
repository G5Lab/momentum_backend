const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/momentum', { useNewUrlParser: true}, err=> {
    if (!err) { console.log('DB connection successful')}
    else{ console.log('Error connecting to DB' +err)}
});

// require('./employee.model');