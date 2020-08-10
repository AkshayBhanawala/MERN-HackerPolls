const AuthServices = require('../helpers/AuthServices');
const Users = require('../models/Users.model');

class AuthController {

	loginUser = async (req, res) => {
		try {
			// Check if someone is logged in or not
			const user = await AuthServices.verifyAndDecodeTokenCookie(req);
			// User already logged in
			res.status(200).send({ status: 200, user: user });
		} catch (err) {
			// User not logged in
			try {
				var loginData = req.body;
				var user = await Users.findOne({ name: { $regex: new RegExp("^" + loginData.name + "$", "i") } }).select('+password -_id -__v').exec();
				if (!user) {
					res.status(401.1).send({ status: 401.1, username: { message: 'User does not exist' } });
				} else if (! await user.passwordMatch(loginData.password)) {
					res.status(401.2).send({ status: 401.2, password: { message: 'Password invalid' } });
				} else {
					user = user.toObject();
					delete user.password;
					var token = AuthServices.getToken(user);
					user = await AuthServices.verifyToken(token);
					res = AuthServices.setTokenCookie(res, token);
					res.status(200).send({ status: 200, user: user });
				}
			} catch (err) {
				console.log('# Login --> Error:');
				console.log(err);
				res.status(500).send({ status: 500, error: err });
			}
		}
	};

	isLoggedIn = async (req, res) => {
		try {
			const user = await AuthServices.verifyAndDecodeTokenCookie(req);
			// User already logged in
			res.status(200).send({ status: 200, isLoggedIn: true, user: user });
		} catch (err) {
			// User not logged in
			res.status(200).send({ status: 200, isLoggedIn: false });
		}
	}

	logout = async (req, res) => {
		res = AuthServices.clearTokenCookie(res);
		res.status(200).send({ status: 200, isLoggedIn: false, headers: res.getHeaders() });
	}

}

module.exports = new AuthController();