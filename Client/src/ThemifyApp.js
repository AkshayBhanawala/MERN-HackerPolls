import React, { Component } from 'react';
import App from './App';
import Config from './helpers/Config';
import "./ThemifyApp.css";

const THEME_NAMES = {
	DARK: "DARK",
	LIGHT: "LIGHT"
}

const THEME_DARK= React.lazy(() => import('./_Themes/Theme-Dark'));
const THEME_LIGHT= React.lazy(() => import('./_Themes/Theme-Light'));

export default class ThemifyApp extends Component {
	static displayName = 'ThemifyApp';
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			ThemeName: undefined
		};

		this.on_ThemeChange_CallBack = this.on_ThemeChange_CallBack.bind(this);
		this.get_ThemeChangeButton = this.get_ThemeChangeButton.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		if (Config.isDebug) console.log(this.constructor.displayName, "Mounted");
		// Code to run when component is loaded
		this.set_ThemeName(this.get_ThemeName());
	}

	componentWillUnmount() {
		this._isMounted = false;
		if (Config.isDebug) console.log(this.constructor.displayName, "Unmounted");
	}

	get_ThemeName() {
		if (this.state.ThemeName) {
			return this.state.ThemeName;
		}
		return localStorage.getItem("ThemeName") || THEME_NAMES.DARK;
	}

	set_ThemeName(TName) {
		localStorage.setItem("ThemeName", TName);
		this.setState({ ThemeName: TName });
	}

	get_ThemeChangeButton() {
		return (<button className="btn_ThemeChange" onClick={this.on_ThemeChange_CallBack}>THEME</button> );
	}

	on_ThemeChange_CallBack() {
		if (this.state.ThemeName === THEME_NAMES.LIGHT) {
			this.set_ThemeName(THEME_NAMES.DARK);
		} else {
			this.set_ThemeName(THEME_NAMES.LIGHT);
		}
	}

	render() {
		return (
			<>
				<React.Suspense fallback={<></>}>
					{(this.state.ThemeName === THEME_NAMES.LIGHT) && <THEME_LIGHT />}
					{(this.state.ThemeName === THEME_NAMES.DARK) && <THEME_DARK />}
				</React.Suspense>
				<App ThemeChangeButton={this.get_ThemeChangeButton} />
			</>
		)
	};
}