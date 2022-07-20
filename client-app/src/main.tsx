import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './app/layout/App';
import { store, StoreContext } from './app/stores/store';
import { createBrowserHistory } from 'history';
import ScrollTopTop from './app/layout/ScrollToTop';

import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './app/layout/styles.css';

export const history = createBrowserHistory();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StoreContext.Provider value={store}>
		<Router history={history}>
			<ScrollTopTop />
			<App />
		</Router>
	</StoreContext.Provider>
);
