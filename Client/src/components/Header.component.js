import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import Config from '../helpers/Config';
import APIRoutes from '../helpers/APIRoutesForClient';
import RoutesForClient from '../helpers/RoutesForClient';
import SVGHacker from './_Custom/SVGHacker';
import './Header.component.css';

export default class Header extends Component {
	static displayName = 'Header';
	_isMounted = false;

	menuCheckBox = React.createRef();

	logOutCallBack = () => {};

	constructor(props) {
		super(props);

		this.state = {
			user: undefined,
			isLoggedOut: undefined,
			isMenuCBChecked: false,
		};

		this.logOutCallBack = this.props.logOutCallBack;

		this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
		this.onClick_Logout = this.onClick_Logout.bind(this);
		this.onClick_Link = this.onClick_Link.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		this.props.setUpdate(this.isUserLoggedIn);
		this.isUserLoggedIn();
		if (Config.isDebug) console.log("Header", "Mounted");
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("Header", "Unmounted");
	}

	isUserLoggedIn() {
		var user = localStorage.getItem("user");
		if (user) {
			user = JSON.parse(user);
			this.setState({
				user: user
			});
		}
		if (Config.isDebug) console.log("Header", "isUserLoggedIn", "user:", user);
	}

	onClick_Logout(event) {
		event.preventDefault();
		axios.post(APIRoutes.LogOut, undefined, { withCredentials: true }).then(res => {
			localStorage.removeItem("user");
			this.setState({
				user: undefined,
				isLoggedOut: true
			});
			this.logOutCallBack();
		}).catch(err => {
			if (Config.isDebug) console.log(err.response);
		});
		this.onClick_Link();
	};

	onClick_Link() {
		if (this.menuCheckBox.current.checked)
			this.menuCheckBox.current.checked = false;
	}

	render() {
		if (Config.isDebug) console.log("Header", "render", 'state', { 'user': this.state.user });
		return (
			<div className="headerWrapper">
				<input ref={this.menuCheckBox} type="checkbox" id="cb_controller" className="cb_controller" defaultChecked={false} />
				<label htmlFor="cb_controller" className="menuIcon">
					<span className="bar1"></span>
					<span className="bar2"></span>
					<span className="bar3"></span>
				</label>
				<div className="header">
					<div className="logo">
						{this.render_Logo()}
					</div>
					{this.render_DisplayName()}
					<div className="linksWrapper">
						<div className="links">
							{this.render_UserLinks()}
						</div>
					</div>
					{this.render_ThemeChangeButton()}
					<div className="description">
						<div className="author">
							<span>Developed by</span>
							<span><a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/akshay-bhanawala-368214ba/">TH3-AZ</a></span>
						</div>
					</div>
					{this.render_Logout()}
				</div>
			</div>
		);
	};

	render_Logo() {
		if (this.state.user) {
			if (this.state.user.isAdmin) {
				return (<Link to={`${RoutesForClient.Admin.Home}`}><SVGHacker /></Link>);
			} else {
				return (<Link to={`${RoutesForClient.User.Home}`}><SVGHacker /></Link>);
			}
		}
		return (<Link to={`${RoutesForClient.Home}`}><SVGHacker /></Link>);
	}

	render_DisplayName() {
		if (this.state.user) {
			return (
				<div className="displayname">
					<span>{this.state.user.name}</span>
				</div>
			);
		}
	}

	render_UserLinks() {
		if (this.state.user) {
			if (this.state.user.isAdmin) {
				return this.render_Links_Admin();
			} else {
				return this.render_Links_User();
			}
		}
		return this.render_Links_NoLogin();
	}

	render_Links_Admin() {
		return (
			<React.Fragment>
				<Link to={`${RoutesForClient.Admin.Home}`} onClick={this.onClick_Link}><span>Home</span></Link>
				<Link to={`${RoutesForClient.Edit}`}><span onClick={this.onClick_Link}>Profile</span></Link>
				<Link to={`${RoutesForClient.Admin.AddUser}`} onClick={this.onClick_Link}><span>Add User</span></Link>
				<Link to={`${RoutesForClient.Admin.DeleteUser}`} onClick={this.onClick_Link}><span>Delete User</span></Link>
				<a href="." onClick={this.onClick_Logout}><span>Logout</span></a>
			</React.Fragment>
		);
	}
	render_Links_User() {
		return (
			<React.Fragment>
				<Link to={`${RoutesForClient.User.Home}`} onClick={this.onClick_Link}><span>Home</span></Link>
				<Link to={`${RoutesForClient.Edit}`} onClick={this.onClick_Link}><span>Profile</span></Link>
				<a href="." onClick={this.onClick_Logout}><span>Logout</span></a>
			</React.Fragment>
		);
	}
	render_Links_NoLogin() {
		return (
			<React.Fragment>
				<Link to={`${RoutesForClient.Home}`} onClick={this.onClick_Link}><span>Home</span></Link>
				<Link to={`${RoutesForClient.Login}`} onClick={this.onClick_Link}><span>Login</span></Link>
			</React.Fragment>
		);
	}

	render_ThemeChangeButton() {
		if (this.props.ThemeChangeButton)
		return (
			<div className="ThemeChangeButton">
				{this.props.ThemeChangeButton()}
			</div>
		);
	}

	render_Logout() {
		if (this.state.isLoggedOut) {
			return (
				<React.Fragment>
					<Redirect to={`${RoutesForClient.Home}`} />
				</React.Fragment>
			);
		}
	}
}
