import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import Loader from '../../../app/layout/Loader';
import { useStore } from '../../../app/stores/store';

const ActivityDetails = () => {
	const { activityStore } = useStore();
	const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
	const { id } = useParams<{ id: string }>();

	useEffect(() => {
		if (id) loadActivity(id);
	}, [id, loadActivity]);

	if (loadingInitial || !activity) return <Loader />;

	return (
		<Card fluid>
			<Image src={`/images/categoryImages/${activity.category}.jpg`} />
			<Card.Content>
				<Card.Header>{activity.title}</Card.Header>
				<Card.Meta>
					<span>{activity.date}</span>
				</Card.Meta>
				<Card.Description>{activity.description}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button.Group widths='2'>
					<Button
						as={Link}
						to={`/manage/${activity.id}`}
						basic
						color='blue'
						content='Edit'
					/>
					<Button as={Link} to='/activities' basic color='grey' content='Cancel' />
				</Button.Group>
			</Card.Content>
		</Card>
	);
};

export default observer(ActivityDetails);
