const RoutesForClient = {
	Home: `/`,
	Login: `/Login`,
	Edit: `/Edit`,
	Admin: {
		Home: `/Admin`,
		AddUser: `/Admin/AddUser`,
		DeleteUser: `/Admin/DeleteUser`
	},
	User: {
		Home: `/User`,
	},
};

module.exports = RoutesForClient;