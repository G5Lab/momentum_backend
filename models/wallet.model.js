const mongoose = require('mongoose');

// schema for wallet,.. The mongoDB table is created using this schema
var WalletSchema = new mongoose.Schema({
    user_id: {
		type: String,
		required: true
    },
	main_balance: {
		type: Number
    },
    savings_balance: {
		type: Number
    },
    investment_balance: {
		type: Number
    },
    interest: {
		type: Number
    },
	date: {
		type: Date,
		default: Date.now
	}
});

// export wallet schema and model to be available across the project
const Wallet = mongoose.model('Wallet', WalletSchema);
module.exports = Wallet;
