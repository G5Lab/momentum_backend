// created by Pedro 14/01/20

const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
    },
    username: {
		type: String,
		required: true
    },
    email: {
		type: String,
		required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
		type: String,
		required: true
    },
    pin: {
		type: String,
		required: true
	},
	dob: {
		type: Date
	},
	profile_picture: {
		type: String
	},
	address: {
		type: String
	},
	state_residence: {
		type: String
	},
	lga_residence: {
		type: String
	},
	postal_code: {
		type: String
	},
	employer: {
		type: String
	},
	employer_address: {
		type: String
	},
	job_description: {
		type: String
	},
	employment_status: {
		type: String
	},
	state_employment: {
		type: String
	},
	lga_employment: {
		type: String
	},
	employer_number: {
		type: Number
	},
	linkedin: {
		type: String,
	},
	facebook: {
		type: String
	},
	instagram: {
		type: String
	},
	idFile: {
		type: String
	},
	idTitle: {
		type: String
	},
	cacCert: {
		type: String
	},
	cacTitle: {
		type: String
	},
	utilTitle: {
		type: String
	},
	utilBill: {
		type: String
	},
	resTitle : {
		type: String
	},
	boardRes: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
