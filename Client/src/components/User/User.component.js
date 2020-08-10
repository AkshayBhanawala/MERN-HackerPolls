import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Config from '../../helpers/Config';
import Redirectors from '../_Custom/Redirectors';
import HelperMethods from '../../helpers/HelperMethods';
import RoutesForClient from '../../helpers/RoutesForClient';
import UsersList from '../UsersList.component';

export default class User extends Component {
	static displayName = 'User';
	_isMounted = false;
	_isRendering = false;

	constructor(props) {
		super(props);

		this.state = {
			user: undefined
		};

		this.redirectToHome = Redirectors.redirectToHome.bind(this);
		this.redirectToAdminHome = Redirectors.redirectToAdminHome.bind(this);

		this.isUserLoggedIn_Local = HelperMethods.isUserLoggedIn_Local.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log("User", "Mounted");
		// Code to run when component is loaded
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("User", "Unmounted");
	}

	render() {
		this._isRendering = true;
		if (Config.isDebug) console.log("User", "render", "state:", this.state);
		return (
			<React.Fragment >
				{this.redirectToHome()}
				{this.redirectToAdminHome()}
				<Switch>
					<Route path={RoutesForClient.User.Home} exact component={UsersList} />
				</Switch>
				{this._isRendering = false}
			</React.Fragment >
		);
	};

}
