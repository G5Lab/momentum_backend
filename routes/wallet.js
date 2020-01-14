const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet.model');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var ObjectId = require('mongoose').Types.ObjectId;


var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(express.json());


// Test page
router.get('/test',(req,res)=> res.send(`Test`));

// Create wallet
router.post('/create', express.json({type: '*/*'}), (req, res) => {
	const { user_id, wallet_balance } = req.body;
		// Check if wallet  exits
		Wallet.findOne({ user_id: user_id })
		.then(wallet=>{
			if (wallet) {
				// If wallet exists
				res.send(false);
				console.log('Wallet exists')
				
			}
			else {
                // console.log(res);
				// create a new wallet
				newWallet = new Wallet ({
					user_id,
					wallet_balance
                });
                // save wallet
                newWallet.save()
                .then( wallet => {
                    console.log('Wallet Created');
                    res.send(true);
                    //console.log(res)
                })
                .catch(err => console.log(err));
			}
		})
		.catch(err => console.log(err));
		// console.log(res.status)	

});

// Fetch wallet details 
router.get('/fetchuserwallet/:id', express.json({type: '*/*'}), (req, res) => {
    var id = req.params.id
    Wallet.findOne({user_id: ObjectId(id)}, (err, docs) => {
        if (!err) {res.send(docs)}
            else { console.log('Error fetching user wallet: ' +JSON.stringify(err, undefined, 2));}
    });
});

// Update wallet -- Could be credit or debit based on the operation
router.put('/updatewallet/:id', express.json({type: '*/*'}), (req, res) => {
    var wallet = {
        wallet_balance : req.body.wallet_balance
    };
    var id = req.body.user_id

    Wallet.updateOne({user_id: ObjectId(id)}, {$set:wallet}, (err, docs) => {
        if (!err) {res.send(docs)}
            else { console.log('Error updating user wallet: ' +JSON.stringify(err, undefined, 2));}
    });
});
            
// Delete user wallet 
router.delete('/delete/:id', express.json({type: '*/*'}), (req, res) => {  
    var id = req.body.user_id
    Wallet.deleteOne({user_id: ObjectId(id)}, (err, docs) => {
        if (!err) {res.send(docs)}
            else { console.log('Error deleting user wallet: ' +JSON.stringify(err, undefined, 2));}
    });
});


// Get user wallet data profile
router.get('/:id', express.json({type: '*/*'}), (req, res) => {
	if (!UserId.isValid(req.params.id))
		return res.status(400).send('No wallet');
	
	Wallet.findById(req.params.id, (err, doc) => {
		if (!err) {res.send(doc)}
		else { console.log('Error retrieving wallet: ' +JSON.stringify(err, undefined, 2));}
	});
});



module.exports = router;
