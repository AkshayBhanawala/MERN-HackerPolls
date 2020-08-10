import React from 'react';
import { Redirect } from "react-router-dom";
import RoutesForClient from '../../helpers/RoutesForClient';
import './OverlayResponse.css';

const Redirectors = {

	redirectToHome() {
		if (!this.isUserLoggedIn_Local()) {
			return (
				<Redirect to={`${RoutesForClient.Home}`} />
			);
		}
	},

	redirectToAdminHome() {
		if (this._isMounted && this.state.user && this.state.user.isAdmin) {
			return (
				<Redirect to={`${RoutesForClient.Admin.Home}`} />
			);
		}
	},

	redirectToUserHome() {
		if (this._isMounted && this.state.user && !this.state.user.isAdmin) {
			return (
				<Redirect to={`${RoutesForClient.User.Home}`} />
			);
		}
	},
}

export default Redirectors;