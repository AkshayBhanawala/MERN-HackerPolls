const router = require('express').Router();
const APIRoutes = require('../helpers/APIRoutesForServer');
const UsersController = require('../controllers/Users.controller');

router.route(APIRoutes.GetAllUsers).get((req, res) => {
	UsersController.getAllUsers(req, res);
});

router.route(APIRoutes.AddUser).put((req, res) => {
	UsersController.addUser(req, res);
});

router.route(APIRoutes.DeleteUser).delete((req, res) => {
	UsersController.deleteUser(req, res);
});

router.route(APIRoutes.EditUser).put((req, res) => {
	UsersController.editUser(req, res);
});

router.route(APIRoutes.VoteUser).patch((req, res) => {
	UsersController.voteUser(req, res);
});

module.exports = router;