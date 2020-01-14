// created by Pedro 14/01/20
require('./models/db');

const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
var app = express();

// passport config

//require('./controllers/passport');

// making the uploads folder publicly available
app.use('/uploads', express.static('uploads'));

// Use body-parser
app.use(bodyparser.urlencoded({
	extended: true
  }));

// Express session
app.use(session({
	secret: 'daemon',
	resave: true,
	saveUninitialized: true,
  }));

// Passport middleware

// app.use(passport.initialize());
// app.use(passport.session());
// require('./controllers/passport')(passport);



// Require employee controller
// const employeeController = require('./controllers/employeeController');

app.use((req, res, next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (req.method === 'OPTIONS') {
		res.header( 'Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/api/users', require('./routes/users'));
// app.use('/api/guarantor', require('./routes/guarantor'));
// app.use('/api/wallet', require('./routes/wallet'));
// app.use('/api/transactions', require('./routes/transactions'));
// app.use('/api/assets', require('./routes/assets'));
// app.use('/api/rental', require('./routes/rental'));
// app.use('/api/rental_applications', require('./routes/rental_applications'));
// app.use('/api/support', require('./routes/support'));


//creating environment variables, and starting server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`express server starteed at port: ${PORT}`)
});

// app.use('/employee', employeeController);
