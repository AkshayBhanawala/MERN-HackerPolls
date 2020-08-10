import React, { Component } from 'react';
import axios from 'axios';
import Config from '../helpers/Config';
import APIRoutes from '../helpers/APIRoutesForClient';
import OverlayUserDetails from './_Custom/OverlayUserDetails';
import OverlayResponse from './_Custom/OverlayResponse';
import HelperMethods from '../helpers/HelperMethods';
import './UsersList.component.css';

export default class UsersList extends Component {
	static displayName = 'UsersList';
	ContentTitle = HelperMethods.reverseString("Hackers");
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			_isFetching: true,
			user: undefined,
			usersList: undefined,
			hasVoted: false,
			isVoteClicked: false,
			OUserDetails: undefined,
			OResponse: undefined
		};
		this.sendVote = this.sendVote.bind(this);
		this.onClick_UserCard = this.onClick_UserCard.bind(this);
		this.onClose_OverlayUserDetails = this.onClose_OverlayUserDetails.bind(this);
		this.onClose_OverlayResponse = this.onClose_OverlayResponse.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		// Code to run when component is loaded
		this.getUsers();
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
	}

	getUsers() {
		this.setState({
			_isFetching: true
		});
		axios.get(APIRoutes.GetAllUsers, undefined, { withCredentials: true }).then((res) => {
			if (Config.isDebug) console.log(this.constructor.displayName, "getUsers", "response:", res);
			if (this._isMounted) {
				this.setState({
					_isFetching: false,
					usersList: res.data.hackers,
					hasVoted: res.data.isVoteGiven
				}, () => {
					localStorage.setItem(Config.LSNames.usersList, JSON.stringify(this.state.usersList));
				});
			}
		}).catch((err) => {
			this.setState({
				_isFetching: false
			});
			if (Config.isDebug) console.log(this.constructor.displayName, "getUsers", "error:", err);
		});
	}

	sendVote(event, name) {
		this.setState({ isVoteClicked: true });

		event.stopPropagation();

		if (this.state.OUserDetails) this.setState({ OUserDetails: undefined });

		axios.patch(APIRoutes.VoteUser, { user: { name: name } }, { withCredentials: true }).then((res) => {
			if (Config.isDebug) console.log(this.constructor.displayName, "sendVote", "response:", res);
			this.setState({
				usersList: res.data.hackers,
				hasVoted: res.data.isVoteGiven
			});
			this.setState({
				OResponse: {
					show: true,
					responseType: OverlayResponse.TYPE.SUCESS,
					responseDescription: "Vote Given",
				}
			});
		}).catch((err) => {
			this.setState({
				OResponse: {
					show: true,
					responseType: OverlayResponse.TYPE.ERROR,
					responseDescription: "Something went wrong",
				}
			});
			if (Config.isDebug) console.log(this.constructor.displayName, "sendVote", "error:", err);
		});
	}

	onClick_UserCard(event, name) {
		event.stopPropagation();
		const user = this.state.usersList.find((user) => user.name === name);
		this.setState({
			OUserDetails: {
				show: true,
				user: user,
				voteButton: this.get_VoteButton(name),
			}
		});
	}

	onClose_OverlayUserDetails() {
		this.setState({
			OUserDetails: undefined
		});
	}

	onClose_OverlayResponse() {
		this.setState({
			OResponse: undefined
		});
	}

	render() {
		return (
			<React.Fragment>
				{this.render_OverlayUserDetails()}
				{this.render_OverlayResponse()}
				<div className="HackedTitle">{this.ContentTitle}</div>
				<div className="UsersList">
					{this.render_UsersList()}
				</div>
			</React.Fragment>
		);
	};

	render_OverlayUserDetails() {
		if (this.state.OUserDetails) {
			return (
				<OverlayUserDetails
					show={this.state.OUserDetails.show}
					user={this.state.OUserDetails.user}
					voteButton={this.state.OUserDetails.voteButton}
					onClose={this.onClose_OverlayUserDetails}
				/>
			);
		}
	}

	render_OverlayResponse() {
		if (this.state.OResponse) {
			return (
				<OverlayResponse
					show={this.state.OResponse.show}
					responseType={this.state.OResponse.responseType}
					responseDescription={this.state.OResponse.responseDescription}
					onClose={this.onClose_OverlayResponse}
				/>
			);
		}
	}

	get_VoteButton(name) {
		if (this.state.hasVoted) {
			return (<button disabled>VOTED</button>);
		}
		return (<button name="vote" title={`Vote ${name}`} onClick={(event) => this.sendVote(event, name)} disabled={this.state.isVoteClicked}>VOTE</button>);
	}

	render_UsersList() {
		if (this.state._isFetching) {
			return (<React.Fragment></React.Fragment>);
		}
		if (!this.state.usersList || this.state.usersList.length === 0) {
			return (
				<div className="NoUsers">
					<span className="Title">Ohh no!!!</span>
					<span>There are no hackers here!</span>
					<span>Please contact site owner</span>
					<span>[Link in the menu]</span>
				</div>
			)
		}
		return (
			<React.Fragment>
				{
					this.state.usersList.map((hacker) => {
							return (
								<div
									key={'key_' + hacker.name}
									className="userCard"
									title={hacker.name}
									onClick={(event) => this.onClick_UserCard(event, hacker.name)}
								>
									<div className="top">
										<div>
											<div className="avatar"><span>{HelperMethods.get_NameInitials(hacker.name)}</span></div>
											<div className="name">{hacker.name}</div>
										</div>
									</div>
									<div className="details">
										<div className="vote-count"><span>Votes :</span><span>{hacker.votes}</span></div>
									</div>
									<div className="vote">
										{this.get_VoteButton(hacker.name)}
									</div>
								</div>
							);
						})
					}
			</React.Fragment>
		);
	};
}
