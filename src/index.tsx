import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppContextProvider } from './context/app.context';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<AppContextProvider>
			<PrimeReactProvider>
				<App />
			</PrimeReactProvider>
		</AppContextProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
