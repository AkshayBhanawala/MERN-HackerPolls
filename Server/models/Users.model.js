const bCrypt = require("bcryptjs");
const Mongoose = require('mongoose');
const Config = require('../helpers/Config');

const subject = new Mongoose.Schema({
	name: {
		type: String,
		trim: true,
	},
	rating: {
		type: Number,
		default: 0,
		min: 1,
		max: 5,
	},
}, {
	_id: false,
});

const usersSchema = new Mongoose.Schema({
	name: {
		type: String,
		unique: true,
		trim: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	password: {
		type: String,
		select: false,
	},
	numSolvedChallenges: {
		type: Number,
		default: 0,
	},
	expertise: [subject],
	hasVoted: {
		type: Boolean,
		default: false,
	},
	votes: {
		type: Number,
		default: 0,
	},
}, {
	timestamps: false,
});

/**
 ********************************************
 * Methods
 ********************************************
 */
usersSchema.methods.passwordEncrypt = async function (textPasssword = undefined) {
	if (!textPasssword) {
		// if called by save method object
		textPasssword = this.password;
	}
	return await bCrypt.hash(textPasssword, Config.bCrypt_saltRounds);
};

usersSchema.methods.passwordMatch = async function (textPasssword) {
	// Encrypt and compare password
	return await bCrypt.compare(textPasssword, this.password);
};

/*
 ********************************************
 * Hooks
 ********************************************
 */
usersSchema.pre("save", async function (next) {
	// Encrypt password before saving
	if (!this.isModified("password")) {
		// check if the user is being created or changed
		return next();
	}
	this.password = await this.passwordEncrypt();
});

const Users = Mongoose.model('Users', usersSchema);

module.exports = Users;