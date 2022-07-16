import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './app/layout/App';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './app/layout/styles.css';
import { store, StoreContext } from './app/stores/store';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StoreContext.Provider value={store}>
		<Router history={history}>
			<App />
		</Router>
	</StoreContext.Provider>
);
