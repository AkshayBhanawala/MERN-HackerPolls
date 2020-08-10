const Config = require("./Config");

const APIRoutesForClient = {
	Test: `${Config.serverURL}/API/Test`,
	LogIn: `${ Config.serverURL }/API/LogIn`,
	IsLoggedIn: `${Config.serverURL}/API/IsLoggedIn`,
	LogOut: `${ Config.serverURL }/API/LogOut`,
	GetAllUsers: `${Config.serverURL}/API/GetAllHackers`,
	AddUser: `${ Config.serverURL }/API/Admin/AddUser`,
	DeleteUser: `${Config.serverURL}/API/Admin/DeleteUser`,
	EditUser: `${ Config.serverURL }/API/EditUser`,
	VoteUser: `${Config.serverURL}/API/VoteUser`,
};

module.exports = APIRoutesForClient;