import React, { Component } from 'react';
import Config from '../../helpers/Config';
import HelperMethods from '../../helpers/HelperMethods';
import SVGClose from './SVGClose';
import SVGStar from './SVGStar';
import './OverlayUserDetails.css';

class OverlayUserDetails extends Component {
	static displayName = 'OverlayUserDetails';

/**==========================
 * props
 * ==========================
 * show
 * 	[true|false]
 *
 *
 * user
 * 	[User details object of following structure]
 *  {
 *    "isAdmin": boolean,
 *    "numSolvedChallenges": number,
 *    "votes": number,
 *    "name": string,
 *    "expertise": [
 *      {
 *        "rating": number,
 *        "name": string
 *      },
 *    ]
 *  }
 *
 *
 * voteButton
 * 	[Button that perform vote]
 *
 *
 * onClose()
 * 	[Event onClose]
 */

	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			reload: false
		};
		this.close = this.close.bind(this)
	}

	componentDidMount() {
		this._isMounted = true;
		// Code to run when component is loaded
		if (Config.isDebug) console.log("OverlayResponse", "Mounted");
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log("OverlayResponse", "Unmounted");
	}


	close() {
		this.setState({
			reload: true
		});
		this.setState({
			reload: false
		});
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	render() {
		if (!this.props.show || !this.props.user) {
			return (<React.Fragment></React.Fragment>);
		}
		return this.renderResponse();
	};

	renderResponse() {
		return (
			<div className={`OverlayUserDetails`}>
				<div className="OverlayCard">
					<div className="CloseBTN">
						<button onClick={(event) => this.close()}><SVGClose /></button>
					</div>
					<div className="CardWrapper">
						<div className="Info">
							<div className="AvatarName">
								<div className="Avatar"><span>{HelperMethods.get_NameInitials(this.props.user.name)}</span></div>
								<div className="Name">{this.props.user.name}</div>
							</div>
							<div className="Details">
								<div className="VoteCount">
									<span className="Text">Votes Received</span>
									<span className="Value">{this.props.user.votes}</span>
								</div>
								<div className="SolvedChallengesCount">
									<span className="Text">Solved Challenges</span>
									<span className="Value">{this.props.user.numSolvedChallenges}</span>
								</div>
								<div className="IsAdmin">
									<span className="Text">Has Admin Rights?</span>
									<span className={`Value ${this.props.user.isAdmin ? "Admin" : "User"}`}>{this.props.user.isAdmin ? "Oh Yeah!" : "Nyet!"}</span>
								</div>
							</div>
						</div>
						<div className="Expertise">
							<div className="Title"><span>Expertise</span></div>
							<div className="ExpertiseList">
								{

									(this.props.user.expertise.length === 0)
										? <div className="None"><span>None</span><span>Well, thats a shame!</span></div>
										: this.props.user.expertise.map((subject, index) => {
											return (
												<div key={"key_" + index} className="ExpertiseItem">
													<div className="Name"><span>{subject.name}</span></div>
													<div className="Rating">
														<span className={`Star ${subject.rating >= 1 ? "Rated" : ""}`}><SVGStar /></span>
														<span className={`Star ${subject.rating >= 2 ? "Rated" : ""}`}><SVGStar /></span>
														<span className={`Star ${subject.rating >= 3 ? "Rated" : ""}`}><SVGStar /></span>
														<span className={`Star ${subject.rating >= 4 ? "Rated" : ""}`}><SVGStar /></span>
														<span className={`Star ${subject.rating >= 5 ? "Rated" : ""}`}><SVGStar /></span>
													</div>
												</div>
											)
										})
								}
							</div>
						</div>
					</div>
					<div className="Vote">
						{this.props.voteButton}
					</div>
				</div>
			</div>
		);
	};

}

export default OverlayUserDetails;