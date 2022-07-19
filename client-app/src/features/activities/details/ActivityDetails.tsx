import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Loader from '../../../app/layout/Loader';
import { useStore } from '../../../app/stores/store';
import ActivityDetailsChat from './ActivityDetailsChat';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsSideBar from './ActivityDetailsSideBar';

const ActivityDetails = () => {
	const { activityStore } = useStore();
	const { selectedActivity: activity, loadActivity, loadingInitial, clearSelectedActivity } = activityStore;
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (id) loadActivity(id);

		return () => clearSelectedActivity();
	}, [id, loadActivity, clearSelectedActivity]);

	if (loadingInitial || !activity) return <Loader />;

	return (
		<Grid>
			<Grid.Column width={10}>
				<ActivityDetailsHeader activity={activity} />
				<ActivityDetailsInfo activity={activity} />
				<ActivityDetailsChat activityId={activity.id} />
			</Grid.Column>

			<Grid.Column width={6}>
				<ActivityDetailsSideBar activity={activity} />
			</Grid.Column>
		</Grid>
	);
};

export default observer(ActivityDetails);
