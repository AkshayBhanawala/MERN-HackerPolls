const Config = require('./ConfigBase');

Config.get_mongodb_CN_string = () => {
	var cns = Config.mongodb_CN.protocol + '://';
	if (Config.mongodb_CN.username && Config.mongodb_CN.password) {
		cns += Config.mongodb_CN.username + ':' + encodeURIComponent(Config.mongodb_CN.password) + '@';
	}
	cns += Config.mongodb_CN.domain;
	if (Config.mongodb_CN.port) {
		cns += ':' + Config.mongodb_CN.port ;
	}
	cns += '/';
	if (Config.mongodb_CN.database) {
		cns += Config.mongodb_CN.database;
	}
	return cns;
};

module.exports = Config;
