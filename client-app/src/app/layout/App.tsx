import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestError from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import Loader from './Loader';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
	const { key } = useLocation();
	const { commonStore, userStore } = useStore();

	useEffect(() => {
		if (commonStore.token) {
			userStore.getUser().finally(() => commonStore.setAppLoaded());
		} else {
			commonStore.setAppLoaded();
		}
	}, [commonStore, userStore]);

	if (!commonStore.appLoaded) return <Loader content='Loading app...' />;

	return (
		<>
			<ToastContainer position='bottom-right' hideProgressBar />
			<Route exact path='/' component={HomePage} />
			<Route
				path={'/(.+)'}
				render={() => (
					<>
						<NavBar />

						<Container style={{ marginTop: '7em' }}>
							<Switch>
								<Route exact path='/activities' component={ActivityDashboard} />
								<Route path='/activities/:id' component={ActivityDetails} />
								<Route
									key={key}
									path={['/createActivity', '/manage/:id']}
									component={ActivityForm}
								/>
								<Route path='/errors' component={TestError} />
								<Route path='/server-error' component={ServerError} />
								<Route path='/login' component={LoginForm} />
								<Route component={NotFound} />
							</Switch>
						</Container>
					</>
				)}
			/>
			<ModalContainer />
		</>
	);
}

export default observer(App);
