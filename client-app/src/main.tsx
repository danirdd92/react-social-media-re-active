import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/layout/App';
import './app/layout/styles.css';
import { store, StoreContext } from './app/stores/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StoreContext.Provider value={store}>
		<App />
	</StoreContext.Provider>
);
