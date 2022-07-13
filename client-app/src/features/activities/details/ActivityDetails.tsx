import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
	activity: Activity;
	unselectActivity: () => void;
	openForm: (id: string) => void;
}

const ActivityDetails = ({ activity, unselectActivity, openForm }: Props) => {
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
					<Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit' />
					<Button onClick={unselectActivity} basic color='grey' content='Cancel' />
				</Button.Group>
			</Card.Content>
		</Card>
	);
};

export default ActivityDetails;
