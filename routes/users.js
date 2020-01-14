// created by Pedro 14/01/20

const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const Wallet = require('../models/wallet.model');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var ObjectId = require('mongoose').Types.ObjectId;





const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({
    storage: storage
});


var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(express.json());

// Login page
router.get('/login',(req,res)=> res.json({ status: true, message: 'user endpoint works', data: null}));



// Handle Registeration
router.post('/register', express.json({type: '*/*'}), (req, res) => {
    // Variables for the request shoulf follow this naming convention
	const { firstname, lastname, email, mobile, username, pinn, passwordd, password2 } = req.body;
		// Check if user  exits
		User.findOne({ email: email})
		.then(user=>{
			if (user) {
				// If user exists with same email
				res.json({ status: false, message: 'user exists with same email', data: null});				
			}
			else {
                User.findOne({ mobile : mobile })
                .then(user=>{
                    if (user) {
                        // If user exists with same number
				        res.json({ status: false, message: 'user exists with same number', data: null});	
                    }
                    else {
                        User.findOne({username : username})
                        .then(user=>{
                            if (user) {
                                // If user exists with same number
				                res.json({ status: false, message: 'user exists with same username', data: null});

                            }
                            else {
                                // Hash pin and password
                                let pin = bcrypt.hashSync(pinn, 10);
                                let password = bcrypt.hashSync(passwordd, 10);

                                // create a new user object
                                newUser = new User ({
                                    firstname,
                                    lastname,
                                    email,
                                    mobile,
                                    username,
                                    pin,
                                    password
                                });
                                // save user to database
                                newUser.save((err, doc)=>{

                                    if (!err) {
                                        // create wallet for user and save usind the user id
                                        var user_id = doc._id;
                                        var main_balance = "0";
                                        var savings_balance = "0";
                                        var investment_balance = "0";
                                        var interest = "0";

                                        newWallet = new Wallet ({
                                            user_id,
                                            main_balance,
                                            savings_balance,
                                            investment_balance,
                                            interest
                                        });
                                        // save wallet
                                        newWallet.save()
                                        .then( wallet => {

                                            res.json({ status: true, message: 'User Created with Wallet', data: null});
                                        })
                                        .catch(err => console.log(err));
                                    }
                                    else { 
                                        // send error
                                        console.log('Error updating user: ' +JSON.stringify(err, undefined, 2));
                                        res.json({ status: false, message: 'error saving user', data: null});
                                    }
                                });
                            }
                        })

                    }

                })
                
            }
        })
		.catch();
	});



// Handle Login
router.post('/login',  express.json({type: '*/*'}), (req, res) =>{
	// set email or username and password variables to the req ie user input
	const {loginid, password} = req.body;

    // find user, and exclude the pin column
	User.findOne( { $or: [ { email: loginid }, { username: loginid }] }, {"pin":0} )
	.then(user=>{
		if (!user) {
			// If user does not exists
			res.json({ status: false, message: 'User not found', data: null});
			// console.log(res)
		}
		else {

            let hash = user.password;
            // Match password
            if(bcrypt.compareSync(password, hash)) {
                //if Passwords match

                // fetch user wallet and return wallet and user details
                var user_id = user._id
                Wallet.findOne({user_id: user_id}, (err, docs) => {
                    if (!err) {
                        // res.json(user);
                        res.json({user: user, wallet: docs});
                        // res.send(docs)
                    }
                    else { console.log('Error fetching user wallet: ' +JSON.stringify(err, undefined, 2));}
                });
               } else {
                // Passwords don't match
                res.json({ status: false, message: 'Password Incorrect', data: null});
               }

		}
	})
	.catch(err => console.log(err));
});





// Update user profile form
router.put('/updateprofile/:id', express.json({type: '*/*'}), (req, res) => {
	if (!ObjectId.isValid(req.params.id))
		return res.status(400).send('No user found with the id');

		// setting data from user to rows in the database
		const { dob, mnumber, address, state_residence, lga_residence, postal_code, employer, job_description, employment_status, employer_address, state_employment, lga_employment, employer_number, linkedin, facebook, instagram } = req.body;

		// set user data to new variable user
		var user = { dob, mnumber, address, state_residence, lga_residence, postal_code, employer, employer_address, job_description, employment_status, state_employment, lga_employment, employer_number, linkedin, facebook, instagram

	};
	// find user by id and update with data in user variable, then return the new data
	User.findByIdAndUpdate(req.params.id, {$set : user}, { new: true}, (err, docs) => {
		if (!err) {res.send(docs)}
			else { console.log('Error updating user: ' +JSON.stringify(err, undefined, 2));}
	});

});

// Get user datas user profile
router.get('/:id', express.json({type: '*/*'}), (req, res) => {
	if (!ObjectId.isValid(req.params.id))
		return res.status(400).send('No user found with the id');
	
	User.findById(req.params.id, (err, doc) => {
		if (!err) {res.send(doc)}
		else { console.log('Error retrieving user: ' +JSON.stringify(err, undefined, 2));}
	});
});

// Upload valid ID
router.post('/kyc_id/:id', upload.single('idFile'), (req, res) => {
		const user_id = req.params.id
		const idTitle = req.body.idTitle;
		const idFile =  req.file.path;
		
		User.findOne({ _id: user_id })
		.then(user=>{
			if (user) {
				var user = { idTitle, idFile};
				User.findByIdAndUpdate(req.params.id, {$set : user}, { new: true}, (err, docs) => {
					if (!err) {res.send(docs)}
						else { console.log('Error updating user: ' +JSON.stringify(err, undefined, 2));}
				});
				
			}
			else {
					res.send(false);
			}
		
	});
});

// Upload CAC cert
router.post('/kyc_cac/:id', upload.single('cacCert'), (req, res) => {
		const user_id = req.params.id
		const cacTitle = req.body.cacTitle;
		const cacCert =  req.file.path;
		
		User.findOne({ _id: user_id })
		.then(user=>{
			if (user) {
				var user = { cacTitle, cacCert};
				User.findByIdAndUpdate(req.params.id, {$set : user}, { new: true}, (err, docs) => {
					if (!err) {res.send(docs)}
						else { console.log('Error updating user: ' +JSON.stringify(err, undefined, 2));}
				});
				
			}
			else {
					res.send(false);
			}
		
	});
});

// Upload Utility Bill
router.post('/kyc_utility/:id', upload.single('utilBill'), (req, res) => {
		const user_id = req.params.id
		const utilTitle = req.body.utilTitle;
		const utilBill =  req.file.path;
		
		User.findOne({ _id: user_id })
		.then(user=>{
			if (user) {
				var user = {utilTitle, utilBill};
				User.findByIdAndUpdate(req.params.id, {$set : user}, { new: true}, (err, docs) => {
					if (!err) {res.send(docs)}
						else { console.log('Error updating user: ' +JSON.stringify(err, undefined, 2));}
				});
				
			}
			else {
					res.send(false);
			}
		
	});
});

// Upload Board Resolution
router.post('/kyc_board/:id', upload.single('boardRes'), (req, res) => {

	const user_id = req.params.id
	const resTitle = req.body.resTitle;
	const boardRes =  req.file.path;
	
	User.findOne({ _id: user_id })
	.then(user=>{
		if (user) {
			var user = {resTitle , boardRes};
			User.findByIdAndUpdate(req.params.id, {$set : user}, { new: true}, (err, docs) => {
				if (!err) {res.send(docs)}
					else { console.log('Error updating user: ' +JSON.stringify(err, undefined, 2));}
			});
			
		}
		else {
				res.send(false);
		}
	
});
});

// Upload Board Resolution
router.post('/update_photo/:id', upload.single('profile_picture'), (req, res) => {

	const user_id = req.params.id
	const profile_picture =  req.file.path;
	
	User.findOne({ _id: user_id })
	.then(user=>{
		if (user) {
			var user = {profile_picture};
			User.findByIdAndUpdate(req.params.id, {$set : user}, { new: true}, (err, docs) => {
				if (!err) {res.send(docs)}
					else { console.log('Error updating user: ' +JSON.stringify(err, undefined, 2));}
			});
			
		}
		else {
				res.send(false);
		}
	
});
});

// Delete data
router.delete('/:id', express.json({type: '*/*'}), (req, res) => {
	// confirm if id exists
	if (!ObjectId.isValid(req.params.id))
		return res.status(400).send('No user found with the id');
	// delete data by id
	 User.findByIdAndDelete(req.params.id, (err, doc) => {
		if (!err) {res.send(doc)}
		else { console.log('Error retrieving user: ' +JSON.stringify(err, undefined, 2));}
	 });

});



module.exports = router;
