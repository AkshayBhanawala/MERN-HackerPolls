import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import OverlayResponse from './_Custom/OverlayResponse';
import Config from '../helpers/Config';
import APIRoutes from '../helpers/APIRoutesForClient';
import HelperMethods from '../helpers/HelperMethods'
import Redirectors from './_Custom/Redirectors';
import SVGPlus from './_Custom/SVGPlus';
import SVGDelete from './_Custom/SVGDelete';
import './_Custom/FormContainer.css';
import './EditUser.component.css';

export default class EditUser extends Component {
	static displayName = 'EditUser';
	ContentTitle = HelperMethods.reverseString("Edit Details");
	logInCallback = () => {};
	_isMounted = true;
	_isRendering = false;

	constructor(props) {
		super(props);

		this.state = {
			inputDisabled: false,
			user: {},
			password: "",
			solvedChallenges: 0,
			expertise: [],
			OResponse: {
				show: false,
				responseType: undefined,
				responseText: undefined,
				responseDescription: undefined,
			}
		}

		this.onSubmitForm = this.onSubmitForm.bind(this);
		this.onChange_Password = this.onChange_Password.bind(this);
		this.onChange_SolvedChallenges = this.onChange_SolvedChallenges.bind(this);
		this.onChange_Expertise = this.onChange_Expertise.bind(this);
		this.onAdd_ExpertiseClick = this.onAdd_ExpertiseClick.bind(this);
		this.onRemove_ExpertiseClick = this.onRemove_ExpertiseClick.bind(this);

		this.redirectToHome = Redirectors.redirectToHome.bind(this);

		this.isUserLoggedIn_Local = HelperMethods.isUserLoggedIn_Local.bind(this);

		this.onOverlayResponse_Close = this.onOverlayResponse_Close.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		// Code to run when component is loaded
		let user = this.isUserLoggedIn_Local();
		this.loadUserData(user);
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
	}

	loadUserData(user) {
		if (user) {
			this.setState({
				user: user,
				solvedChallenges: user.numSolvedChallenges,
				expertise: user.expertise
			});
		}
	}

	onChange_Password(event) {
		this.setState({
			password: event.target.value
		});
	}

	onChange_SolvedChallenges(event) {
		this.setState({
			solvedChallenges: event.target.value
		});
	}

	onAdd_ExpertiseClick(event) {
		// handle click event of the Add button
		this.setState({
			expertise: [
				...this.state.expertise,
				{ rating: 1, name: "" }
			]
		});
	};

	onRemove_ExpertiseClick(event, index) {
		// handle click event of the Remove button
		const expertise = this.state.expertise;
		expertise.splice(index, 1);
		this.setState({
			expertise: expertise
		});
	};

	onChange_Expertise(event, index) {
		// handle input change
		const { name, value } = event.target;
		const expertise = this.state.expertise;
		expertise[index][name] = value;
		this.setState({
			expertise: expertise
		});
	}

	onSubmitForm(event) {
		event.preventDefault();

		this.setState({
			inputDisabled: true
		});

		const data = {
			user: {
				password: this.state.password,
				numSolvedChallenges: this.state.solvedChallenges,
				expertise: this.state.expertise
			}
		};
		this.setState({
			password: ""
		});

		axios.put(APIRoutes.EditUser, data, { withCredentials: true }).then(res => {
			let user = this.state.user;
			user.numSolvedChallenges = this.state.solvedChallenges;
			user.expertise = this.state.expertise;
			localStorage.setItem('user', JSON.stringify(user));
			this.setState({
				user: user,
				inputDisabled: false,
				OResponse: {
					show: true,
					responseType: OverlayResponse.TYPE.SUCESS,
					responseText: "Profile Updated!",
					responseDescription: "Details are Saved!",
				}
			});
		}).catch(err => {
			this.setState({
				inputDisabled: false
			});
			this.processError(err);
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
				this.setState({
					OResponse: {
						show: true,
						responseType: OverlayResponse.TYPE.ERROR,
						responseText: "Not logged in!",
						responseDescription: "Login is required to edit profile.",
					}
				});
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
		this._isRendering = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "render", 'state', this.state);
		return (
			<React.Fragment>
				{this.redirectToHome()}
				{this.render_OverlayResponse()}
				{this.render_EditUser()}
				{this._isRendering = false}
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

	render_EditUser() {
		return (
			<div className="wrapper_custom">
				<div className="HackedTitle">{this.ContentTitle}</div>
				<div className="formContainer">
					<form className="form editUser" onSubmit={this.onSubmitForm}>
						<div className="form-group text-left">
							<label htmlFor="tb_password">New Password</label>
							<input id="tb_password"
								type="password"
								className="tb"
								placeholder="[KEEP]"
								pattern="[\s\S]*\S[\s\S]*"
								title="To keep old Password, leave this blank"
								value={this.state.password}
								onChange={this.onChange_Password}
								disabled={this.state.inputDisabled}
							/>
						</div>
						<div className="form-group text-left">
							<label htmlFor="tb_solvedChallenges">Solved Challenges</label>
							<input id="tb_solvedChallenges"
								type="number"
								className="tb"
								title="How many Challenges you solved?"
								value={this.state.solvedChallenges}
								onChange={this.onChange_SolvedChallenges}
								disabled={this.state.inputDisabled}
							/>
						</div>
						{this.render_Expertise()}
						<div className="buttons">
							<Button
								type="submit"
								title="Save details"
								disabled={this.state.inputDisabled}
							>Save</Button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	render_Expertise() {
		return (
			<div className="expertise_list form-group">
				<div className="head">
					<div className="title">Exepertise</div>
					<div className="add_btn">
						<Button
							id="btn_AddExpertise"
							title="Add new expertise"
							onClick={(event) => this.onAdd_ExpertiseClick(event)}
							disabled={this.state.inputDisabled}
						><SVGPlus /></Button>
					</div>
				</div>
				{
					this.state.expertise.map((subject, index) => {
						return (
							<div key={"key_" + index} className="expertise_item">
								<input name="name"
									required
									type="text"
									pattern="[\s\S]*\S[\s\S]*"
									className="tb"
									value={subject.name}
									title="Expertise In?"
									placeholder="Expertise In?"
									onChange={(event) => this.onChange_Expertise(event, index)}
									disabled={this.state.inputDisabled}
								/>
								<input name="rating"
									required
									type="number"
									min="1" max="5"
									className="tb"
									value={subject.rating}
									title="Rate Yourself"
									placeholder="Rate Yourself"
									onChange={(event) => this.onChange_Expertise(event, index)}
									disabled={this.state.inputDisabled}
								/>
								<Button
									id="btn_RemoveExpertise"
									title="Remove this expertise"
									onClick={(event) => this.onRemove_ExpertiseClick(event, index)}
									disabled={this.state.inputDisabled}
								><SVGDelete /></Button>
							</div>
						);
					})
				}
			</div>
		);
	}

}
