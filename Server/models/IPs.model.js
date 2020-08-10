const Mongoose = require('mongoose');

const IPsSchema = new Mongoose.Schema({
	ip: {
		type: String,
		unique: true,
		trim: true,
	}
}, {
	timestamps: false,
	versionKey: false
});

const IPs = Mongoose.model('IPs', IPsSchema);

module.exports = IPs;