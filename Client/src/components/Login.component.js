import React, { Component } from 'react';
import axios from 'axios';
import OverlayResponse from './_Custom/OverlayResponse';
import Config from '../helpers/Config';
import APIRoutes from '../helpers/APIRoutesForClient';
import HelperMethods from '../helpers/HelperMethods'
import Redirectors from './_Custom/Redirectors';
import './_Custom/FormContainer.css';

export default class Login extends Component {
	static displayName = 'Login';
	ContentTitle = HelperMethods.reverseString("Login");
	logInCallback = () => {};
	_isMounted = true;

	constructor(props) {
		super(props);

		this.logInCallback = this.props.logInCallback;

		this.state = {
			user: undefined,
			username: "",
			password: "",
			inputDisabled: undefined,
			showErrors: undefined,
			errors: {},
			hideAllErrorsTimeout: () => { },
			OResponse: {
				show: false,
				responseType: undefined,
				responseText: undefined,
				responseDescription: undefined,
			},
		};

		this.hideAllErrorsTimeoutFunc = this.hideAllErrorsTimeoutFunc.bind(this);
		this.onClick_hideInputErrorFunc = this.onClick_hideInputErrorFunc.bind(this);
		this.onChange_Username = this.onChange_Username.bind(this);
		this.onChange_Password = this.onChange_Password.bind(this);
		this.onClick_Submit = this.onClick_Submit.bind(this);

		this.redirectToAdminHome = Redirectors.redirectToAdminHome.bind(this);
		this.redirectToUserHome = Redirectors.redirectToUserHome.bind(this);

		this.isUserLoggedIn_Local = HelperMethods.isUserLoggedIn_Local.bind(this);

		this.onOverlayResponse_Close = this.onOverlayResponse_Close.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		// Code to run when component is loaded
		this.setState({
			OResponse: undefined,
		});
		this.isUserLoggedIn_Local();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
	}

	hideAllErrorsTimeoutFunc() {
		this.setState({
			hideAllErrorsTimeout: setTimeout(() => {
				this.setState({ showErrors: false });
				clearTimeout(this.state.hideAllErrorsTimeout);
			}, 5000)
		});
	}

	onClick_hideInputErrorFunc(e) {
		var new_errors = this.state.errors;
		new_errors[e.target.getAttribute('for')] = undefined;
		this.setState({
			errors: new_errors
		});
	}

	onChange_Username(e) {
		this.setState({
			username: e.target.value
		});
	}

	onChange_Password(e) {
		this.setState({
			password: e.target.value
		});
	}

	onClick_Submit(e) {
		e.preventDefault();

		if (this.state.inputDisabled) {
			return;
		}

		clearTimeout(this.state.hideAllErrorsTimeout);

		this.setState({
			inputDisabled: true
		});

		const user = {
			name: this.state.username,
			password: this.state.password
		};

		axios.post(APIRoutes.LogIn, user, { withCredentials: true }).then(res => {
			this.performLogin(res.data.user);
		}).catch(err => {
			this.processError(err);
		});
	}

	performLogin(user) {
		localStorage.setItem('user', JSON.stringify(user));
		this.setState({
			user: user
		});
		this.logInCallback();
	}

	processError(err) {
		if (err.response) {
			if (err.response.status === 500) {
				this.setState({
					inputDisabled: false,
					OResponse: {
						show: true,
						responseType: OverlayResponse.TYPE.ERROR
					},
				});
				if (Config.isDebug) console.log(this.constructor.displayName, "processError", 'err.response.data', err.response.data);
			} else if (err.response.data.status === 401.3) {
				this.setState({
					inputDisabled: false
				});
			} else {
				this.setState({
					inputDisabled: false,
					showErrors: true,
					errors: err.response.data
				});
				this.hideAllErrorsTimeoutFunc();
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
				{this.redirectToAdminHome()}
				{this.redirectToUserHome()}
				{this.render_OverlayResponse()}
				{this.renderLogin()}
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

	renderLogin() {
		return (
			<div className="wrapper_custom">
				<div className="HackedTitle">{this.ContentTitle}</div>
				<div className="formContainer">
					<form onSubmit={this.onClick_Submit}>
						<div className="form-group text-left">
							<label htmlFor="tb_username">Username</label>
							<input id="tb_username"
								type="text"
								required
								className="tb"
								value={this.state.username}
								onChange={this.onChange_Username}
								disabled={this.state.inputDisabled}
							/>
							<div className={`inputError ${
								(this.state.showErrors && this.state.errors.username) ? "show" : "hide"}`}>
								<span htmlFor='username' onClick={this.onClick_hideInputErrorFunc}>
									{
										this.state.errors.username
											? this.state.errors.username.message
											: ""
									}
								</span>
							</div>
						</div>
						<div className="form-group text-left">
							<label htmlFor="tb_password">Password</label>
							<input id="tb_password"
								type="password"
								required
								className="tb"
								value={this.state.password}
								onChange={this.onChange_Password}
								disabled={this.state.inputDisabled}
							/>
							<div className={`inputError ${
								(this.state.showErrors && this.state.errors.password) ? "show" : "hide"}`}>
								<span htmlFor='password' onClick={this.onClick_hideInputErrorFunc}>
									{
										this.state.errors.password
											? this.state.errors.password.message
											: ""
									}
								</span>
							</div>
						</div>
						<div className="buttons">
							<input type="submit"
								value="Login"
								disabled={this.state.inputDisabled}
							/>
						</div>
					</form>
				</div>
			</div>
		);
	};

}
