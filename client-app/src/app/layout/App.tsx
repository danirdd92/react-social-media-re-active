import 'semantic-ui-css/semantic.min.css';
import { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loader from './Loader';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
	const { activityStore } = useStore();
	const { loadingInitial } = activityStore;

	useEffect(() => {
		activityStore.loadActivities();
	}, [activityStore]);

	if (loadingInitial) return <Loader content='Loading app....' />;

	return (
		<>
			<NavBar />

			<Container style={{ marginTop: '7em' }}>
				<ActivityDashboard />
			</Container>
		</>
	);
}

export default observer(App);
