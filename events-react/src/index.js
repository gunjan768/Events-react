import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import * as serviceWorker from './serviceWorker';

const renderRoot = () =>
{
	ReactDOM.render(
		<React.StrictMode>
			<Main />
		</React.StrictMode>,
	
		document.getElementById('root')
	);

	serviceWorker.register();
}

renderRoot();