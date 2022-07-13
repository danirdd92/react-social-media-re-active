import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface Props {
	activities: Activity[];
	selectedActivity?: Activity;
	selctActivity: (id: string) => void;
	unselectActivity: () => void;
	editMode: boolean;
	openForm: (id: string) => void;
	closeForm: () => void;
	createOrEdit: (activity: Activity) => void;
	deleteActivity: (id: string) => void;
}
const ActivityDashboard = ({
	activities,
	selectedActivity,
	selctActivity,
	unselectActivity,
	editMode,
	openForm,
	closeForm,
	createOrEdit,
	deleteActivity,
}: Props) => {
	return (
		<Grid>
			<Grid.Column width='10'>
				<ActivityList activities={activities} selctActivity={selctActivity} deleteActivity={deleteActivity} />
			</Grid.Column>
			<Grid.Column width='6'>
				{selectedActivity && !editMode && <ActivityDetails activity={selectedActivity} unselectActivity={unselectActivity} openForm={openForm} />}
				{editMode && <ActivityForm activity={selectedActivity} closeForm={closeForm} createOrEdit={createOrEdit} />}
			</Grid.Column>
		</Grid>
	);
};

export default ActivityDashboard;
