const router = require('express').Router();
const APIRoutes = require('../helpers/APIRoutesForServer');
const AuthController = require('../controllers/Auth.controller');

router.route(APIRoutes.LogIn).post((req, res) => {
	AuthController.loginUser(req, res);
});

router.route(APIRoutes.IsLoggedIn).post((req, res) => {
	AuthController.isLoggedIn(req, res);
});

router.route(APIRoutes.LogOut).post((req, res) => {
	AuthController.logout(req, res);
});

module.exports = router;