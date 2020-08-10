const ConfigBase = {
	secret: '*******DELETED*******',
	jwt_token_expire_in_seconds: 60 * 60, // 1 hour,
	bCrypt_saltRounds: 10,

	// Local Config
	websiteDomain: 'http://localhost:3000',
	mongodb_CN: {
		protocol: 'mongodb',
		username: undefined,
		password: undefined,
		domain: 'localhost',
		port: 27017,
		database: 'MERNHackerPolls'
	},

	// Deploy Config
	//
};

module.exports = ConfigBase;
