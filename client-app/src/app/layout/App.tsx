import 'semantic-ui-css/semantic.min.css';
import { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api';
import Loader from './Loader';

function App() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		agent.activities.list().then((response) => {
			const activities: Activity[] = response.map((a) => {
				const date = a.date.split('T')[0];
				return { ...a, date };
			});

			setActivities(activities);
			setLoading(false);
		});
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
		setSubmitting(() => true);
		if (activity.id) {
			agent.activities.update(activity).then(() => {
				setActivities([...activities.filter((x) => x.id !== activity.id), activity]);
				setSelectedActivity(activity);
				setEditMode(false);
				setSubmitting(() => false);
			});
		} else {
			activity.id = uuid();
			agent.activities.create(activity).then(() => {
				setActivities([...activities, activity]);
				setSelectedActivity(activity);
				setEditMode(false);
				setSubmitting(() => false);
			});
		}
	};

	const handleDeleteActivity = (id: string) => {
		setSubmitting(() => true);
		agent.activities.delete(id).then(() => {
			setActivities([...activities.filter((x) => x.id !== id)]);
			setSubmitting(() => false);
		});
	};

	if (loading) return <Loader content='Loading app....' />;

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
					submitting={submitting}
				/>
			</Container>
		</>
	);
}

export default App;
