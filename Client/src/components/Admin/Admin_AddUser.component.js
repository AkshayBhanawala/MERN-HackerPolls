import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import OverlayResponse from '../_Custom/OverlayResponse';
import Config from '../../helpers/Config';
import APIRoutes from '../../helpers/APIRoutesForClient';
import HelperMethods from '../../helpers/HelperMethods'

export default class Admin_AddUser extends Component {
	static displayName = 'Admin_AddUser';
	ContentTitle = HelperMethods.reverseString("Add User");
	_isMounted = true;

	constructor(props) {
		super(props);

		this.state = {
			inputDisabled: false,
			username: "",
			password: "",
			cnfPassword: "",
			OResponse: {
				show: false,
				responseType: undefined,
				responseText: undefined,
				responseDescription: undefined,
			}
		}

		this.onSubmitForm = this.onSubmitForm.bind(this);
		this.onChange_Username = this.onChange_Username.bind(this);
		this.onChange_Password = this.onChange_Password.bind(this);
		this.onChange_CnfPassword = this.onChange_CnfPassword.bind(this);

		this.onOverlayResponse_Close = this.onOverlayResponse_Close.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		// Code to run when component is loaded
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
	}

	onChange_Username(event) {
		this.setState({
			username: event.target.value
		});
	}

	onChange_Password(event) {
		this.setState({
			password: event.target.value
		});
	}

	onChange_CnfPassword(event) {
		this.setState({
			cnfPassword: event.target.value
		});
	}

	onSubmitForm(event) {
		event.preventDefault();

		this.setState({
			inputDisabled: true
		});

		const data = {
			user: {
				name: this.state.username,
				password: this.state.password,
			}
		};
		this.setState({
			password: "",
			cnfPassword: ""
		});

		axios.put(APIRoutes.AddUser, data, { withCredentials: true }).then(res => {
			this.updateLocalStorage();
			this.setState({
				username: "",
				inputDisabled: false,
				OResponse: {
					show: true,
					responseType: OverlayResponse.TYPE.SUCESS,
					responseText: "User Added!",
					responseDescription: `Tell ${this.state.username} to login and update their profile!`,
				}
			});
		}).catch(err => {
			this.setState({
				inputDisabled: false
			});
			this.processError(err);
		});
	}

	updateLocalStorage() {
		let usersList = JSON.parse(localStorage.getItem(Config.LSNames.usersList)) || [];
		usersList.push({ name: this.state.username });
		localStorage.setItem(Config.LSNames.usersList, JSON.stringify(usersList));
	}

	processError(err) {
		if (err.response) {
			if (err.response.status === 500) {
				this.setState({
					OResponse: {
						show: true,
						responseType: OverlayResponse.TYPE.ERROR
					},
				});
				if (Config.isDebug) console.log(this.constructor.displayName, "processError", 'err.response.data', err.response.data);
			} else if (err.response.status === 409) {
				this.setState({
					OResponse: {
						show: true,
						responseType: OverlayResponse.TYPE.ERROR,
						responseText: "User Exist!",
						responseDescription: `"${this.state.username}" already in the system.`,
					}
				});
			} else if (err.response.status === 401) {
				if (err.response.data.state === 401.1) {
					this.setState({
						OResponse: {
							show: true,
							responseType: OverlayResponse.TYPE.ERROR,
							responseText: "Not logged in!",
							responseDescription: "Admin login is required to access this.",
						}
					});
				} else if (err.response.data.state === 401.2) {
					this.setState({
						OResponse: {
							show: true,
							responseType: OverlayResponse.TYPE.ERROR,
							responseText: "Not Admin!",
							responseDescription: "You aren't allowed to access this.",
						}
					});
				}
			} else {
				if (Config.isDebug) console.log(err.response);
			}
		}
	}

	onOverlayResponse_Close() {
		this.setState({
			OResponse: undefined
		});
	}

	render() {
		if (Config.isDebug) console.log(this.constructor.displayName, "render", 'state', this.state);
		return (
			<React.Fragment>
				{this.render_OverlayResponse()}
				{this.render_AddUser()}
			</React.Fragment>
		)
	};

	render_OverlayResponse() {
		if (this.state.OResponse) {
			return (
				<OverlayResponse
					show={this.state.OResponse.show}
					responseType={this.state.OResponse.responseType}
					responseText={this.state.OResponse.responseText}
					responseDescription={this.state.OResponse.responseDescription}
					onClose={this.onOverlayResponse_Close}
				/>
			);
		}
	}

	render_AddUser() {
		return (
			<div className="wrapper_custom">
				<div className="HackedTitle">{this.ContentTitle}</div>
				<div className="formContainer">
					<form className="form" onSubmit={this.onSubmitForm}>
						<div className="form-group text-left">
							<label htmlFor="tb_username">Username</label>
							<input required
								id="tb_username"
								type="text"
								className="tb"
								placeholder="Username"
								pattern="[\s\S]*\S[\s\S]*"
								title="Name of the user / A Username"
								value={this.state.username}
								onChange={this.onChange_Username}
								disabled={this.state.inputDisabled}
							/>
						</div>
						<div className="form-group text-left">
							<label htmlFor="tb_password">Password</label>
							<input required
								id="tb_password"
								type="password"
								className="tb"
								placeholder="Password"
								pattern="[\s\S]*\S[\s\S]*"
								title="Login Password"
								value={this.state.password}
								onChange={this.onChange_Password}
								disabled={this.state.inputDisabled}
							/>
						</div>
						<div className="form-group text-left">
							<label htmlFor="tb_cnf_password">Confirm Password</label>
							<input required
								id="tb_cnf_password"
								type="password"
								className="tb"
								placeholder="Confirm Password"
								pattern={this.state.password}
								title="Type same as password"
								value={this.state.cnfPassword}
								onChange={this.onChange_CnfPassword}
								disabled={this.state.inputDisabled}
							/>
						</div>
						<div className="buttons">
							<Button
								type="submit"
								title="Add User"
								disabled={this.state.inputDisabled}
							>Add User</Button>
						</div>
					</form>
				</div>
			</div>
		);
	};

}