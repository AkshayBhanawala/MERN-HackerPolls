import React, { Component } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import App from '../App';
import Config from '../helpers/Config';
import RoutesForClient from '../helpers/RoutesForClient';
import User from './User/User.component';
import Admin from './Admin/Admin.component';

export default class AfterLogin extends Component {
	static displayName = 'AfterLogin';
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			user: undefined,
			userDisplayName: undefined,
		};
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log("AfterLogin", "Mounted");
		this.isUserLoggedIn();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("AfterLogin", "Unmounted");
	}

	isUserLoggedIn() {
		this.setState({
			user: undefined,
		});
		var user = localStorage.getItem("user");
		if (user) {
			user = JSON.parse(user);
			const expDate = new Date(user.exp * 1000);
			const curDate = new Date();
			if (curDate > expDate) {
				localStorage.removeItem("user");
				user = undefined;
			}
			if (user && this._isMounted) {
				this.setState({
					user: user,
					userDisplayName: user.name,
				});
			}
		}
		if (Config.isDebug) {
			user = localStorage.getItem("user");
			if (user) {
				user = JSON.parse(user);
			}
			console.log("App", "isLoggedIn", 'state', this.state);
		}
	}

	render() {
		if (Config.isDebug) console.log("AfterLogin", "render", this.state);
		return (
			<React.Fragment>
				{this.redirectToLogin()}
				{this.renderHome()}
				{this.redirectToAdminHome()}
				{this.redirectToUserHome()}
			</React.Fragment>
		);
	};

	renderHome() {
		if (this._isMounted && this.state.user) {
			return (
				<React.Fragment>
					<h1>Welcome {this.state.user.name}</h1>
					<Route path={`${RoutesForClient.Admin.Home}`} exact component={Admin} />
					<Route path={`${RoutesForClient.User.Home}`} exact component={User} />
				</React.Fragment>
			);
		}
	};

	redirectToLogin() {
		if (this._isMounted && !this.state.user) {
			return (
				<React.Fragment>
					<App />
					<Redirect to={`${RoutesForClient.Home}`} />
				</React.Fragment>
			);
		}
	}

	redirectToAdminHome() {
		if (this._isMounted && this.state.user && this.state.user.admin) {
			return (
				<React.Fragment>
					<Admin />
					<Redirect to={`${RoutesForClient.Admin.Home}`} />
				</React.Fragment>
			);
		}
	}

	redirectToUserHome() {
		if (this._isMounted && this.state.user && !this.state.user.admin) {
			return (
				<React.Fragment>
					<User />
					<Redirect to={`${RoutesForClient.User.Home}`} />
				</React.Fragment>
			);
		}
	}

}
