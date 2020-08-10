import React, { Component } from 'react';
import Config from '../../helpers/Config';
import SVGCheck from './SVGCheck';
import SVGClose from './SVGClose';
import './OverlayResponse.css';

const TYPE = {
	SUCESS: "success",
	ERROR: "error"
}
const ICONS = {
	success: <SVGCheck />,
	error: <SVGClose />
};
const TEXT = {
	success: "Sucess!",
	error: "Oh no!"
};

const DESC = {
	success: "It Worked!!!",
	error: "It didn't Work!!!"
};

const BUTTONTEXT = {
	success: "Awesome",
	error: "OK"
};

class OverlayResponse extends Component {
	static displayName = 'OverlayResponse';
/**
 * ==========================
 * props
 * ==========================
 * show
 * 	[true|false]
 *
 * responseType
 * 	[success|error]
 *
 * responseText
 * 	[Text to show as main title]
 *
 * responseDescription
 * 	[Description to show as secondary detail]
 *
 * buttonText
 * 	[Text for button]
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
		if (!this.props.show) {
			return (<React.Fragment></React.Fragment>);
		}
		return this.renderResponse();
	};

	renderResponse() {
		return (
			<div className={`OverlayResponse ${this.props.responseType}`}>
				<div className="OverlayCard">
					<div className="top">
						<div>
							<div className="icon">{OverlayResponse.ICONS[this.props.responseType]}</div>
							<div className="text">{this.props.responseText || OverlayResponse.TEXT[this.props.responseType]}</div>
						</div>
					</div>
					<div className="details">
						<div className="description">{this.props.responseDescription || OverlayResponse.DESC[this.props.responseType]}</div>
					</div>
					<div className="closeBtn">
						<button onClick={(event) => this.close()}>{this.props.buttonText || OverlayResponse.BUTTONTEXT[this.props.responseType]}</button>
					</div>
				</div>
			</div>
		);
	};

}

OverlayResponse.TYPE = TYPE;
OverlayResponse.ICONS = ICONS;
OverlayResponse.TEXT = TEXT;
OverlayResponse.DESC = DESC;
OverlayResponse.BUTTONTEXT = BUTTONTEXT;

export default OverlayResponse;