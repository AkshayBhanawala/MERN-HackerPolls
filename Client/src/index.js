import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import ThemifyApp from './ThemifyApp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
			<ThemifyApp />
		</HashRouter>
	</React.StrictMode>,
	document.getElementById('root')
);