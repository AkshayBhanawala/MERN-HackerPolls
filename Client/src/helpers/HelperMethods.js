import Config from './Config';

const HelperMethods = {

	isUserLoggedIn_Local() {
		var user = localStorage.getItem("user");
		if (user == null) {
			user = undefined;
		}
		if (user) {
			user = JSON.parse(user);
			const expDate = new Date(user.exp * 1000);
			const curDate = new Date();
			if (curDate > expDate) {
				localStorage.removeItem("user");
				user = undefined;
			}
			if (user && this._isMounted && !this._isRendering) {
				this.setState({
					user: user
				});
			}
		}
		if (Config.isDebug) console.log(this.constructor.displayName, "isUserLoggedIn_Local", 'state', this.state);
		return user;
	},

	reverseString(str) {
		return str.split('').reverse().join('');
	},

	get_NameInitials(name) {
		return name.split(" ").map((namePart) => { return namePart.charAt(0) }).join('');
	}

};

export default HelperMethods;