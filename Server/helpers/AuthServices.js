const jwt = require('jsonwebtoken');
const Config = require('./Config');
const IPs = require('../models/IPs.model');

class AuthServices {

	verifyLogin = async (req) => {
		try {
			var user = await this.verifyAndDecodeTokenCookie(req);
			return user;
		} catch (err) {}
		return false;
	};

	isVoteGiven = async (req) => {
		var isVoteGiven = false;
		const IP = await this.isIPNew(req);
		const user = await this.verifyLogin(req);
		isVoteGiven = !IP;
		if (user) {
			isVoteGiven = (isVoteGiven || user.hasVoted);
		}
		return [isVoteGiven, IP, user];
	};

	isIPNew = async (req) => {
		const IP = this.getProperIP(req);
		if (await IPs.findOne({ ip: IP })) {
			return false;
		}
		return IP;
	};

	getProperIP = (req) => {
		const forwarded = req.headers['x-forwarded-for'];
		return (forwarded) ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
	};

	// Set JWT token in cookies - authorization
	setTokenCookie = (res, token) => {
		let aliveTime = Config.jwt_token_expire_in_seconds * 1000;  // 1 hour
		res = res.cookie('authorization', `Bearer ${token}`, {
			maxAge: aliveTime,
			httpOnly: true,
			//secure: true, // when network is HTTPS
			sameSite: 'lax',
		});
		return res;
	};

	// Remove JWT token from cookies - authorization
	clearTokenCookie = (res) => {
		res = res.clearCookie('authorization', {
			maxAge: 0,
			httpOnly: true,
			//secure: true, // when network is HTTPS
			sameSite: 'lax'
		});
		return res;
	};

	// Generate JWT token and return user
	getTokenData = (user) => {
		let token = this.getToken(user);
		let data = {
			user: user,
			token: token
		}
		return data;
	};

	// Generate JWT token only
	getToken = (user) => {
		let token = jwt.sign(
			user,
			Config.secret,
			{ expiresIn: Config.jwt_token_expire_in_seconds }
		);
		return token;
	};

	// Verify token from cookies - authorization
	verifyAndDecodeTokenCookie = async (req) => {
		if (req.cookies && req.cookies.authorization) {
			var token = req.cookies.authorization.split(" ")[1];
			try {
				const user = this.verifyToken(token);
				return Promise.resolve(user);
			} catch (err) {
				return Promise.reject({
					error: {
						status: 400.2,
						message: "Cookie token expired"
					}
				});
			}
		} else {
			// Token cookie not found
			return Promise.reject({
				error: {
					status: 400.1,
					message: "Cookie token not found"
				}
			});
		}
	};

	// Verify token from headers - authorization
	verifyAndDecodeTokenHeader = async (req) => {
		if (req.headers && req.headers.authorization) {
			var token = req.cookies.authorization.split(" ")[1];
			try {
				const user = this.verifyToken(token);
				return Promise.resolve(user);
			} catch (err) {
				return Promise.reject({
					error: {
						status: 400.2,
						message: "Header token expired"
					}
				});
			}
		} else {
			// Token cookie not found
			return Promise.reject({
				error: {
					status: 400.1,
					message: "Header token not found"
				}
			});
		}
	};

	// Verify token
	verifyToken = async (token) => {
		try {
			var user = await jwt.verify(token, Config.secret);
			return Promise.resolve(user);
		} catch (err) {
			// Token not valid
			return Promise.reject({
				error: {
					status: 400.9,
					message: "Token not valid"
				}
			});
		}
	};

}

module.exports = new AuthServices();