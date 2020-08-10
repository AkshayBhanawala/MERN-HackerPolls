import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Switch, Route } from "react-router-dom";
import Config from './helpers/Config';
import Header from './components/Header.component';
import Login from './components/Login.component';
import User from './components/User/User.component';
import Admin from './components/Admin/Admin.component';
import UsersList from './components/UsersList.component';
import Redirectors from './components/_Custom/Redirectors';
import HelperMethods from './helpers/HelperMethods';
import RoutesForClient from './helpers/RoutesForClient';
import EditUser from './components/EditUser.component';

export default class App extends Component {
	static displayName = 'App';
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			user: undefined,
			updateUsersList: false
		};

		this.logInCallback = this.logInCallback.bind(this);
		this.logOutCallBack = this.logOutCallBack.bind(this);

		this.redirectToAdminHome = Redirectors.redirectToAdminHome.bind(this);
		this.redirectToUserHome = Redirectors.redirectToUserHome.bind(this);

		this.isUserLoggedIn_Local = HelperMethods.isUserLoggedIn_Local.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log("App", "Mounted");
		// Code to run when component is loaded
		this.isUserLoggedIn_Local();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("App", "Unmounted");
		localStorage.removeItem(Config.LSNames.usersList)
	}

	logInCallback() {
		this.doHeaderUpdate();
	}

	logOutCallBack() {
		this.setState({
			updateUsersList: true
		});
	}

	render() {
		if (Config.isDebug) console.log("App", "render", this.state);
		return (
			<React.Fragment>
				<Header
					setUpdate={(updateFN) => {
						this.doHeaderUpdate = updateFN;
					}}
					logOutCallBack={this.logOutCallBack}
					ThemeChangeButton={this.props.ThemeChangeButton}
				/>
				{this.redirectToAdminHome()}
				{this.redirectToUserHome()}
				<Container className="MainContainer">
					<Switch>
						<Route path={RoutesForClient.Home} exact component={() => (!this.state.user || this.state.updateUsersList) ? <UsersList /> : <React.Fragment />} />
						<Route path={RoutesForClient.Login} exact component={() => <Login logInCallback={this.logInCallback} />} />
					</Switch>
					<Switch>
						<Route path={RoutesForClient.Admin.Home} component={Admin} />
					</Switch >
					<Switch>
						<Route path={RoutesForClient.User.Home} component={User} />
					</Switch>
					<Switch>
						<Route path={RoutesForClient.Edit} component={EditUser} />
					</Switch >
				</Container>
			</React.Fragment>
		);
	};
}