import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Config from '../../helpers/Config';
import Redirectors from '../_Custom/Redirectors';
import HelperMethods from '../../helpers/HelperMethods';
import RoutesForClient from '../../helpers/RoutesForClient';
import UsersList from '../UsersList.component';
import Admin_AddUser from './Admin_AddUser.component';
import Admin_DeleteUser from './Admin_DeleteUser.component';

export default class Admin extends Component {
	static displayName = 'Admin';
	_isMounted = false;

	_isRendering = false;

	constructor(props) {
		super(props);

		this.state = {
			user: undefined
		};

		this.redirectToHome = Redirectors.redirectToHome.bind(this);
		this.redirectToUserHome = Redirectors.redirectToUserHome.bind(this);

		this.isUserLoggedIn_Local = HelperMethods.isUserLoggedIn_Local.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log("Admin", "Mounted");
		// Code to run when component is loaded
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("Admin", "Unmounted");
	}

	render() {
		this._isRendering = true;
		if (Config.isDebug) console.log("Admin", "render", "state:", this.state);
		return (
			<React.Fragment >
				{this.redirectToHome()}
				{this.redirectToUserHome()}
				<Switch>
					<Route path={RoutesForClient.Admin.Home} exact component={UsersList} />
				</Switch>
				<Switch>
					<Route path={RoutesForClient.Admin.AddUser} exact component={Admin_AddUser} />
				</Switch>
				<Switch>
					<Route path={RoutesForClient.Admin.DeleteUser} exact component={Admin_DeleteUser} />
				</Switch>
				{this._isRendering = false}
			</React.Fragment >
		);
	};

}