const AuthServices = require('../helpers/AuthServices');
const Users = require('../models/Users.model');
const IPs = require('../models/IPs.model');

class UsersController {

	getAllUsers = async (req, res) => {
		try {
			const users = await Users.find({}, { '_id': 0, 'hasVoted': 0, '__v': 0 });
			if (req) {
				const [isVoteGiven, IP, user] = await AuthServices.isVoteGiven(req);
				res.status(200).send({ status: 200, hackers: users, isVoteGiven: isVoteGiven });
			} else {
				res.status(200).send({ status: 200, hackers: users, isVoteGiven: true });
			}
		} catch (err) {
			console.log('# getAllUsers --> Error:');
			console.log(err)
			res.status(500).send({ status: 500, error: err });
		}
	};

	addUser = async (req, res) => {
		const user = await AuthServices.verifyLogin(req);
		if (!user) {
			res.status(401.1).send({ status: 401.1, error: "Not Logged In" });
			return;
		} else if (!user.isAdmin) {
			res.status(401.2).send({ status: 401.2, error: "Not Admin User" });
			return;
		}
		try {
			await new Users({
				name: req.body.user.name,
				password: req.body.user.password,
				numSolvedChallenges: req.body.user.numSolvedChallenges,
				expertise: req.body.user.expertise
			}).save();
			res.status(201).send({ status: 201, success: true });
		} catch (err) {
			if (err.keyPattern) {
				res.status(409).send({ status: 409, error: err.keyPattern });
			} else {
				console.log('# addUser --> Error:');
				console.log(err)
				res.status(500).send({ status: 500, error: err });
			}
		}
	};

	deleteUser = async (req, res) => {
		const user = await AuthServices.verifyLogin(req);
		if (!user) {
			res.status(401.1).send({ status: 401.1, error: "Not Logged In" });
			return;
		} else if (!user.isAdmin) {
			res.status(401.2).send({ status: 401.2, error: "Not Admin User" });
			return;
		}
		try {
			await Users.deleteOne({name: req.body.user.name});
			res.status(200).send({ status: 200, success: true });
		} catch (err) {
			console.log('# deleteUser --> Error:');
			console.log(err)
			res.status(500).send({ status: 500, error: err });
		}
	};

	editUser = async (req, res) => {
		const user = await AuthServices.verifyLogin(req);
		if (!user) {
			res.status(401).send({ status: 401, error: "Not Logged In" });
			return;
		}
		try {
			let update = {};
			if (req.body.user.password && req.body.user.password.length > 0) {
				update["password"] = await Users.schema.methods.passwordEncrypt(req.body.user.password);
			}
			if (req.body.user.numSolvedChallenges) {
				update["numSolvedChallenges"] = req.body.user.numSolvedChallenges;
			}
			if (req.body.user.numSolvedChallenges) {
				update["expertise"] = req.body.user.expertise;
			}
			await Users.updateOne(
				{ name: user.name },
				update,
				{ runValidators: true }
			);
			res.status(200).send({ status: 200, success: true });
		} catch (err) {
			console.log('# editUser --> Error:');
			console.log(err)
			res.status(500).send({ status: 500, error: err });
		}
	};

	voteUser = async (req, res) => {
		try {
			const [isVoteGiven, IP, user] = await AuthServices.isVoteGiven(req);
			if (IP) {
				await new IPs({ ip: IP }).save();
			}
			if (user) {
				await Users.updateOne(
					{ name: user.name },
					{ hasVoted: true });
			}
			if (isVoteGiven) {
				res.status(409).send({ status: 409, error: "Vote Already Given" });
				return;
			}
			await Users.updateOne(
				{ name: req.body.user.name },
				{ $inc: { 'votes': 1 } },
				{ runValidators: true });
			this.getAllUsers(undefined, res);
		} catch (err) {
			console.log('# voteUser --> Error:');
			console.log(err)
			res.status(500).send({ status: 500, error: err });
		}
	};
}

module.exports = new UsersController();