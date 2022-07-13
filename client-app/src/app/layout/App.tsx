import 'semantic-ui-css/semantic.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		const controller = new AbortController();
		axios
			.get<Activity[]>('http://localhost:5000/api/activities', {
				signal: controller.signal,
			})
			.then((res) => {
				setActivities(res.data);
			});

		return () => controller.abort();
	}, []);

	const selectActivity = (id: string) => {
		setSelectedActivity(() => activities.find((x) => x.id === id));
	};

	const unselectActivity = () => {
		setSelectedActivity(undefined);
	};

	const handleFormOpen = (id?: string) => {
		id ? selectActivity(id) : unselectActivity();
		setEditMode(true);
	};

	const handleFormClose = () => {
		setEditMode(false);
	};

	const handleCreateOrEditActivity = (activity: Activity) => {
		activity.id
			? setActivities([...activities.filter((x) => x.id !== activity.id), activity])
			: setActivities([...activities, { ...activity, id: uuid() }]);
		setEditMode(false);
		setSelectedActivity(activity);
	};

	const handleDeleteActivity = (id: string) => {
		setActivities([...activities.filter((x) => x.id !== id)]);
	};
	return (
		<>
			<NavBar openForm={handleFormOpen} />

			<Container style={{ marginTop: '7em' }}>
				<ActivityDashboard
					activities={activities}
					selectedActivity={selectedActivity}
					selctActivity={selectActivity}
					unselectActivity={unselectActivity}
					editMode={editMode}
					openForm={handleFormOpen}
					closeForm={handleFormClose}
					createOrEdit={handleCreateOrEditActivity}
					deleteActivity={handleDeleteActivity}
				/>
			</Container>
		</>
	);
}

export default App;
