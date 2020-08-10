import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import OverlayResponse from '../_Custom/OverlayResponse';
import Config from '../../helpers/Config';
import APIRoutes from '../../helpers/APIRoutesForClient';
import HelperMethods from '../../helpers/HelperMethods';

export default class Admin_DeleteUser extends Component {
	static displayName = 'Admin_DeleteUser';
	ContentTitle = HelperMethods.reverseString("Delete User");
	_isMounted = true;

	constructor(props) {
		super(props);

		this.state = {
			inputDisabled: false,
			usersList: [],
			username: "",
			OResponse: {
				show: false,
				responseType: undefined,
				responseText: undefined,
				responseDescription: undefined,
			}
		}

		this.onSubmitForm = this.onSubmitForm.bind(this);
		this.onChange_Username = this.onChange_Username.bind(this);

		this.onOverlayResponse_Close = this.onOverlayResponse_Close.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		// Code to run when component is loaded
		let UList = localStorage.getItem(Config.LSNames.usersList);
		if (UList && UList.length > 2) {
			UList = JSON.parse(UList).filter((user) => !user.isAdmin);
		}
		this.setState({
			usersList: UList
		});
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

	onSubmitForm(event) {
		event.preventDefault();

		this.setState({
			inputDisabled: true
		});

		const data = {
			user: {
				name: this.state.username,
			}
		};

		axios.delete(APIRoutes.DeleteUser, { data: data, withCredentials: true }).then(res => {
			this.setState({
				inputDisabled: false,
				OResponse: {
					show: true,
					responseType: OverlayResponse.TYPE.SUCESS,
					responseText: "User Deleted!",
					responseDescription: `Tell ${this.state.username}, "You've been DELETED!"`,
				}
			});
			this.updateLocalStorage();
		}).catch(err => {
			this.setState({
				inputDisabled: false
			});
			this.processError(err);
		});
	}

	updateLocalStorage() {
		const usersList = this.state.usersList.filter((user) => user.name !== this.state.username);
		this.setState({
			usersList: usersList
		});
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
				{this.render_DeleteUser()}
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

	render_DeleteUser() {
		return (
			<div className="wrapper_custom">
				<div className="HackedTitle">{this.ContentTitle}</div>
				<div className="formContainer">
					<form className="form" onSubmit={this.onSubmitForm}>
						<div className="form-group text-left">
							<label htmlFor="dd_username">User to Delete</label>
							<select
								id="dd_username"
								options={this.state.usersList}
								className="tb"
								placeholder="Username"
								onChange={this.onChange_Username}
								disabled={this.state.inputDisabled}
							>
								{
									this.state.usersList.map((user, index) => {
										return (<option key={"key_option_" + index} value={user.name}>{user.name}</option>)
									})
								}
							</select>
						</div>
						<div className="buttons">
							<Button
								type="submit"
								title="Add User"
								disabled={this.state.inputDisabled}
							>Delete User</Button>
						</div>
					</form>
				</div>
			</div>
		);
	};

}